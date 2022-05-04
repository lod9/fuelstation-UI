fx_version "adamant"
game "gta5"

ui_page 'html/index.html'

server_scripts {
	"@mysql-async/lib/MySQL.lua",
	"config.lua",
	"server.lua"
}

client_scripts {
	"config.lua",
	"client.lua"
}

dependency 'fuel-popui'
files {
  'html/index.html',
  'html/style.css', 
  'html/main.js',
}              