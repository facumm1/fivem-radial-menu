local isRadialMenuOpen = false

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)

        if IsControlPressed(0, Config.KeyForRadialMenu) and not isRadialMenuOpen then
            isRadialMenuOpen = true
            SendNUIMessage({ action = 'openRadialMenu', data = Config.RadialMenuItems })
            SetNuiFocus(true, true)
            SetNuiFocusKeepInput(true)
        end

        if not IsControlPressed(0, Config.KeyForRadialMenu) and isRadialMenuOpen then
            isRadialMenuOpen = false
            SendNUIMessage({ action = 'closeRadialMenu' })
            SetNuiFocus(false, false)
        end
    end
end)

RegisterNUICallback("sendItemClicked", function()
    SendNUIMessage({ action = 'closeRadialMenu' })
    SetNuiFocus(false, false)
end)

RegisterNUICallback("sendItemSelected", function(data)
    if (data.text == '') then
        return
    end

    TriggerMenuFunction(data.text)
end)

function TriggerMenuFunction(itemSelected)
    print("Item selected from NUI: " .. itemSelected)
end
