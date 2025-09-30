#!/usr/bin/env node

// Script para obtener la IP local del sistema

const os = require('os');

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Filtrar IPv4 y no loopback
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({
          interface: name,
          address: iface.address
        });
      }
    }
  }

  return ips;
}

const ips = getLocalIPs();

console.log('\n🌐 IP Locales encontradas:\n');

if (ips.length === 0) {
  console.log('❌ No se encontraron IPs locales');
  console.log('   Asegúrate de estar conectado a una red\n');
  process.exit(1);
}

ips.forEach(({ interface: iface, address }) => {
  console.log(`  ${iface}: ${address}`);
});

console.log('\n📱 URLs para compartir:\n');

const port = process.env.PORT || 3001;

ips.forEach(({ address }) => {
  console.log(`  http://${address}:${port}`);
});

console.log('\n💡 Comparte estas URLs con otros jugadores en tu red local\n');