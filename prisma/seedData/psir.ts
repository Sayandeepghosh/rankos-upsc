import { PrismaClient } from "@prisma/client";

export async function seedPSIR(prisma: PrismaClient) {
  const thinkerPlato = await prisma.thinker.create({
    data: {
      name: "Plato",
      era: "Ancient Greece (428–348 BCE)",
      school: "Philosophical Idealism",
      importantWorks: "The Republic, The Statesman, The Laws",
      coreConcepts: "Theory of Forms/Ideas, Ideal State, Philosopher King, Allegory of the Cave, Tripartite Soul, Communism of Wives and Property",
      famousArguments: "Reality is a shadow of ideas. Until philosophers are kings, cities will never have rest from their evils. Justice is specialization and non-interference.",
      scholarlyViews: "Ernest Barker: Plato is father of political idealism; Karl Popper: Plato is enemy of the open society and father of totalitarianism; Nettleship: Republic is primarily a book on education.",
      criticisms: "Utopian and authoritarian. Subordinates individual liberty entirely to the state. Abolition of family ignores human psychology (Aristotle).",
      contemporaryUsage: "Technocratic governance vs democratic populism; meritocratic civil services; intellectual aristocracy in public policy formulation.",
    },
  });

  const thinkerAristotle = await prisma.thinker.create({
    data: {
      name: "Aristotle",
      era: "Classical Greece (384–322 BCE)",
      school: "Philosophical Realism & Teleology",
      importantWorks: "Politics, Nicomachean Ethics, Constitution of Athens",
      coreConcepts: "Man is by nature a political animal, Golden Mean, Theory of State, Citizenship, Distributive Justice, Polity (Rule of Middle Class), Theory of Slavery",
      famousArguments: "State comes into existence for the sake of life, and continues for the sake of good life. The whole is prior to the part. Law is reason free from passion.",
      scholarlyViews: "Maxey: Aristotle is the first political scientist; Sabine: Aristotle's ideal is constitutional rule; Barker: Aristotle is moderate and conservative.",
      criticisms: "Justification of natural slavery and patriarchal exclusion of women from citizenship. Ethnocentric bias towards Greek polis.",
      contemporaryUsage: "Deliberative democracy, republican virtue, constitutional supremacy, socio-economic inequality and the stabilizing role of middle class.",
    },
  });

  const thinkerRawls = await prisma.thinker.create({
    data: {
      name: "John Rawls",
      era: "Contemporary (1921–2002)",
      school: "Egalitarian Liberalism",
      importantWorks: "A Theory of Justice (1971), Political Liberalism (1993), The Law of Peoples (1999)",
      coreConcepts: "Justice as Fairness, Original Position, Veil of Ignorance, Equal Liberty Principle, Fair Equality of Opportunity, Difference Principle, Maximin rule",
      famousArguments: "Justice is the first virtue of social institutions, as truth is of systems of thought. Inequalities are justified only if they benefit the least advantaged.",
      scholarlyViews: "Robert Nozick: Critique of patterned distribution; Amartya Sen: Niti (transcendental) vs Nyaya (realized justice); Michael Sandel: Unencumbered self critique.",
      criticisms: "Libertarians argue it violates self-ownership; Marxists argue it accommodates capitalist property relations; Communitarians argue individuals cannot be detached from community.",
      contemporaryUsage: "Affirmative action, progressive taxation, Universal Basic Income (UBI), welfare state policies, climate justice and intergenerational equity.",
    },
  });

  const thinkerNozick = await prisma.thinker.create({
    data: {
      name: "Robert Nozick",
      era: "Contemporary (1938–2002)",
      school: "Libertarianism / Right-Wing Liberalism",
      importantWorks: "Anarchy, State, and Utopia (1974)",
      coreConcepts: "Entitlement Theory of Justice, Minimal State (Night-Watchman State), Self-Ownership, Historical vs End-State Principles, Wilt Chamberlain example",
      famousArguments: "Individuals have rights, and there are things no person or group may do to them without violating their rights. Taxation of earnings from labor is on a par with forced labor.",
      scholarlyViews: "G.A. Cohen: Critique of self-ownership; Dworkin: Resource egalitarian response; Kymlicka: Libertarianism ignores arbitrariness of initial acquisition.",
      criticisms: "Ignores systemic historical injustice; absolute property rights neglect basic human survival needs; lack of public education and healthcare.",
      contemporaryUsage: "Deregulation, minimal government interference, cryptocurrency, intellectual property debates, wealth tax controversies.",
    },
  });

  await prisma.quote.createMany({
    data: [
      {
        thinkerId: thinkerPlato.id,
        quoteText: "Until philosophers rule as kings or those who are now called kings and leading men genuinely and adequately philosophise, cities will have no rest from evils.",
        author: "Plato",
        subject: "PSIR",
        theme: "Leadership & Statecraft",
        usageContext: "Use in answers on political executive competence, ethical administration, or technocratic governance.",
      },
      {
        thinkerId: thinkerAristotle.id,
        quoteText: "Law is reason free from passion.",
        author: "Aristotle",
        subject: "PSIR",
        theme: "Rule of Law",
        usageContext: "Use in constitutionalism, judicial review, or rule of law vs arbitrary executive discretion.",
      },
      {
        thinkerId: thinkerRawls.id,
        quoteText: "Justice is the first virtue of social institutions, as truth is of systems of thought.",
        author: "John Rawls",
        subject: "PSIR",
        theme: "Justice",
        usageContext: "Essential opening quote for GS-4 Ethics questions on social justice, equality, and affirmative action.",
      },
      {
        quoteText: "We must make our political democracy a social democracy as well. Political democracy cannot last unless there lies at the base of it social democracy.",
        author: "Dr. B.R. Ambedkar",
        subject: "Polity",
        theme: "Constitutional Democracy",
        usageContext: "Use in GS-2 and Essay conclusions addressing socio-economic rights, Directive Principles, and preamble values.",
      },
    ],
  });

  return { thinkerPlato, thinkerAristotle, thinkerRawls, thinkerNozick };
}
