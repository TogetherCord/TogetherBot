async function getInstanceNumber(){
    try {
        const response = await fetch('http://localhost:3333/instance/containers/list', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "x-api-key": "OmZ5TDJRARai4P0617sL0IIB3oV1CzxP"
            }
        });
        const data = await response.json();
        return data.data; // Retourne data.data directement
    } catch (error) {
        console.error('Error:', error);
        return 0; // Retourne 0 en cas d'erreur
    }
}

module.exports = getInstanceNumber;