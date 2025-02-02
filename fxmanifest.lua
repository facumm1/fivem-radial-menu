fx_version 'cerulean'
lua54 'yes'
games { 'gta5' }

name 'radial_menu'
author 'lix'
version '1.0'
description 'A radial menu'

ui_page 'web/build/index.html'

files {
    'lua/client.lua',
    'lua/server.lua',
    'web/build/index.html',
    'web/build/**/*',
    'web/public/*.json',
    'config.lua'
}

shared_script {
    'config.lua'
}

client_scripts {
    'lua/client.lua',
}

server_scripts {
    'lua/server.lua',
}
