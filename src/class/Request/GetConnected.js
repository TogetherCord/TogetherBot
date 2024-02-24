async function GetConnected(action, interaction){
    const res = await fetch(
        "http://togethercord.unknownandev.me:3333/instance/containers/connected",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "OmZ5TDJRARai4P0617sL0IIB3oV1CzxP"
            },
        }
    );
    const data = await res.json();
    return data;
}

module.exports = GetConnected;