//CraftHammer made by Xargana
const mineflayer = require('mineflayer');
const readline = require('readline');

// Launch console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask questions
const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

// Function to generate a random username
const generateRandomUsername = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let username = '';
  for (let i = 0; i < 6; i++) {
    username += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return username;
};

// Function to get server details from the user
const getServerDetails = async () => {
  const serverIP = await askQuestion('Enter server IP: ');
  const serverPort = (await askQuestion('Enter server port (25565 if left empty): ')) || '25565';
  const botCount = parseInt(await askQuestion('Enter number of bots: '), 10);

  return { serverIP, serverPort, botCount };
};

// Main function to run CraftHammer
const runCraftHammer = async () => {
  console.clear();

  // Get server details from the user
  const { serverIP, serverPort, botCount } = await getServerDetails();

  rl.close(); // Close the input stream once inputs are gathered

  const bots = [];

  // Delay function
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Create bots and attempt to connect them
  for (let i = 1; i <= botCount; i++) {
    await delay(4000); // 4-second delay between bot connections

    const botUsername = generateRandomUsername(); // Generate a random username for each bot

    const bot = mineflayer.createBot({
      host: serverIP,
      port: serverPort,
      username: botUsername,
    });

    bots.push(bot);

    // Handle events for each bot
    bot.on('spawn', () => {
      console.log(`[${botUsername}] Connected to server at ${serverIP}:${serverPort}`);
    });

    bot.on('end', () => {
      console.log(`[${botUsername}] Disconnected from the server.`);
    });

    bot.on('error', (err) => {
      console.error(`[${botUsername}] Error:`, err);
    });
  }
};

// Start CraftHammer
runCraftHammer().catch(console.error);
