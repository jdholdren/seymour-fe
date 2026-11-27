const samples = [
  {
    publication: 'Systems Notebook',
    title: 'The quiet return of the monolith',
    description: 'What teams discover when they bring their services back under one roof.',
    body: 'A shared deployment can give a small team something surprisingly valuable: the ability to follow a change from start to finish. When the boundaries between modules are clear, one codebase can hold a great deal of complexity without asking everyone to hold it in their heads.',
    minutes: 12,
  },
  {
    publication: 'Small Data',
    title: 'The joy of keeping data in one file',
    description: 'A closer look at what a single SQLite file makes possible.',
    body: 'Keeping data close changes the shape of an application. Backups can become copies, queries become local calls, and small programs can carry their state wherever they go. The interesting question is how long those advantages hold as the application grows.',
    minutes: 3,
  },
  {
    publication: 'Design Ledger',
    title: 'The economics of software design',
    description: 'How the cost of change shapes the decisions we make today.',
    body: 'Design decisions have a price paid over time. A familiar interface may cost more to build today and less to explain next month. Before investing in an abstraction, ask which changes it will make cheaper and who will have to learn it.',
    minutes: 8,
  },
  {
    publication: 'Engineering Practice',
    title: 'The changing role of senior engineers',
    description: 'How engineering responsibilities shift as teams adopt new tools and workflows.',
    body: 'As tools make implementation faster, the work of choosing what to implement becomes more visible. Senior engineers can help teams ask better questions, reduce uncertainty early, and create room for others to build good judgment.',
    minutes: 6,
  },
  {
    publication: 'Storage Notes',
    title: 'Building a better B-tree',
    description: 'A tour of the small decisions that make an index efficient.',
    body: 'An index is designed around the work it must avoid. Packing keys into pages reduces random reads, while a careful split policy makes room for future writes. The details depend on how often data changes and which keys are usually read together.',
    minutes: 9,
  },
]

const sampleTime = new Date().setHours(12, 0, 0, 0)

export const sampleFeeds = samples.map(({ publication, description }, index) => {
  const id = `feed-${index + 1}`
  return {
    id,
    feed_id: id,
    name: publication,
    feed_name: publication,
    description,
    feed_description: description,
    last_synced: new Date(sampleTime).toISOString(),
  }
})

export const sampleEntries = [
  ...samples.map(({ title, description, body, minutes, publication }, index) => ({
    id: `entry-${index + 1}`,
    entry_id: `entry-${index + 1}`,
    feed_id: sampleFeeds[index].id,
    feed_name: publication,
    title,
    description,
    reading_minutes: minutes,
    published_at: new Date(sampleTime - index * 3600000).toISOString(),
    status: 'approved',
    reader_content: `<p>${body}</p>`,
  })),
  {
    id: 'entry-6',
    entry_id: 'entry-6',
    feed_id: sampleFeeds[0].id,
    feed_name: sampleFeeds[0].name,
    title: 'A field guide to reversible decisions',
    description: 'Making it easy to revisit small decisions as you learn.',
    reading_minutes: 5,
    published_at: new Date(sampleTime - 86400000).toISOString(),
    status: 'approved',
    reader_content:
      '<p>Write down what would change your mind before making a decision. When that evidence arrives, you can revisit the decision without first reconstructing the conversation that produced it.</p>',
  },
]
