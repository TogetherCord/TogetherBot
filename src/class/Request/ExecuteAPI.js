async function ExecuteAPI(action, interaction){
    const res = await fetch(
        "http://togethercord.unknownandev.me:3333/instance/containers/execute",
        {
            method: "POST",
            body: JSON.stringify({
                discordId: interaction.user.id,
                action: action,
            }),
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "OmZ5TDJRARai4P0617sL0IIB3oV1CzxP"
            },
        }
    );
    const data = await res.json();
    return data;
}

module.exports = ExecuteAPI;