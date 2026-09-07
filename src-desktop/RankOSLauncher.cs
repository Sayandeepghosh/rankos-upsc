using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Threading;
using System.Windows.Forms;

namespace RankOS
{
    static class Program
    {
        private static NotifyIcon trayIcon;
        private static Process serverProcess = null;
        private static string appUrl = "http://localhost:3000";

        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            // Setup System Tray Icon
            trayIcon = new NotifyIcon();
            trayIcon.Text = "RankOS — UPSC CSE Operating System";
            trayIcon.Icon = SystemIcons.Shield; // Standard clean shield icon
            trayIcon.Visible = true;

            ContextMenu menu = new ContextMenu();
            menu.MenuItems.Add("🏛️ Open Command Center", (s, e) => LaunchBrowser(appUrl));
            menu.MenuItems.Add("🎯 Today's Mission", (s, e) => LaunchBrowser(appUrl + "/today"));
            menu.MenuItems.Add("⚡ Prelims Practice", (s, e) => LaunchBrowser(appUrl + "/prelims"));
            menu.MenuItems.Add("✍️ Mains Practice", (s, e) => LaunchBrowser(appUrl + "/mains"));
            menu.MenuItems.Add("🔄 Spaced Revision", (s, e) => LaunchBrowser(appUrl + "/revision"));
            menu.MenuItems.Add("-");
            menu.MenuItems.Add("❌ Exit RankOS", (s, e) => {
                trayIcon.Visible = false;
                if (serverProcess != null && !serverProcess.HasExited)
                {
                    try { serverProcess.Kill(); } catch { }
                }
                Application.Exit();
            });

            trayIcon.ContextMenu = menu;
            trayIcon.DoubleClick += (s, e) => LaunchBrowser(appUrl);

            // Check if server is already running
            if (!IsServerRunning(appUrl))
            {
                trayIcon.ShowBalloonTip(3000, "RankOS Desktop", "Starting RankOS local server...", ToolTipIcon.Info);
                StartLocalServer();
            }

            // Launch the dedicated application window
            LaunchBrowser(appUrl);

            trayIcon.ShowBalloonTip(3000, "RankOS — UPSC Operating System", "RankOS is live in AIR 1 Mode. Access via system tray anytime.", ToolTipIcon.Info);

            Application.Run();
        }

        private static bool IsServerRunning(string url)
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Timeout = 1500;
                request.Method = "GET";
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    return response.StatusCode == HttpStatusCode.OK;
                }
            }
            catch
            {
                return false;
            }
        }

        private static void StartLocalServer()
        {
            string appDir = AppDomain.CurrentDomain.BaseDirectory;

            // If running from dist or subfolder, check parent folder for package.json
            if (!File.Exists(Path.Combine(appDir, "package.json")))
            {
                DirectoryInfo parentDir = Directory.GetParent(appDir);
                if (parentDir != null && File.Exists(Path.Combine(parentDir.FullName, "package.json")))
                {
                    appDir = parentDir.FullName;
                }
            }

            try
            {
                ProcessStartInfo psi = new ProcessStartInfo();
                psi.FileName = "cmd.exe";
                psi.Arguments = "/c npm run start";
                psi.WorkingDirectory = appDir;
                psi.WindowStyle = ProcessWindowStyle.Hidden;
                psi.CreateNoWindow = true;
                psi.UseShellExecute = false;

                serverProcess = Process.Start(psi);

                // Wait up to 15 seconds for server to be responsive
                for (int i = 0; i < 30; i++)
                {
                    Thread.Sleep(500);
                    if (IsServerRunning(appUrl))
                        break;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Unable to automatically start RankOS server:\n" + ex.Message + "\n\nPlease ensure Node.js is installed.", "RankOS Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        private static void LaunchBrowser(string url)
        {
            // 1. Try Microsoft Edge in App Mode (looks like a native desktop app!)
            string edgePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe");
            if (!File.Exists(edgePath))
            {
                edgePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe");
            }

            if (File.Exists(edgePath))
            {
                string appDataProfile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "RankOS", "DesktopProfile");
                Process.Start(edgePath, string.Format("--app=\"{0}\" --user-data-dir=\"{1}\" --app-id=RankOS_UPSC", url, appDataProfile));
                return;
            }

            // 2. Try Google Chrome in App Mode
            string chromePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe");
            if (!File.Exists(chromePath))
            {
                chromePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe");
            }

            if (File.Exists(chromePath))
            {
                string appDataProfile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "RankOS", "DesktopProfile");
                Process.Start(chromePath, string.Format("--app=\"{0}\" --user-data-dir=\"{1}\"", url, appDataProfile));
                return;
            }

            // 3. Fallback to default browser
            Process.Start(url);
        }
    }
}
