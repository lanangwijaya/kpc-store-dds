export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { u } = req.query;
  if (!u) return res.status(400).json({ error: 'missing username' });

  try {
    // Step 1: cari user by username
    const r1 = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [u], excludeBannedUsers: false })
    });
    const d1 = await r1.json();

    if (!d1.data || d1.data.length === 0) {
      return res.status(404).json({ error: 'not found' });
    }

    const user = d1.data[0];

    // Step 2: avatar
    const r2 = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=true`);
    const d2 = await r2.json();
    const avatar = d2.data?.[0]?.imageUrl || '';

    return res.status(200).json({
      id: user.id,
      username: user.name,
      displayName: user.displayName,
      avatar
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

