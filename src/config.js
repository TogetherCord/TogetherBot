module.exports = {
    client: {
        token: "MTE4Njc3ODE3NDU2NzIyMzM1Ng.GIgYtF.IF_KcOUwMf3qSmLU6ufIx39R_mqRu2l_1phjaw",
        id: "1186778174567223356",
    },
    handler: {
        prefix: "?",
        deploy: true,
        commands: {
            prefix: false,
            slash: true,
            user: false,
            message: false,
        },
        mongodb: {
            uri: "",
            toggle: false,
        },
    },
    users: {
        developers: ["921126770340683886","635536565434581043", "1127594734219710504"],
    },
    development: { 
        enabled: true,
        guild: "1174431851658608660",
    }, 
    messageSettings: {
        nsfwMessage: "The current channel is not a NSFW channel.",
        developerMessage: "You are not authorized to use this command.",
        cooldownMessage: "Slow down buddy! You're too fast to use this command.",
        globalCooldownMessage: "Slow down buddy! This command is on a global cooldown.",
        notHasPermissionMessage: "You do not have the permission to use this command.",
        notHasPermissionComponent: "You do not have the permission to use this component.",
        missingDevIDsMessage: "This is a developer only command, but unable to execute due to missing user IDs in configuration file."
    }
};