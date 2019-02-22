const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

const configuration = {
    host: "localhost",
    dialect: "mysql"
};

const sequelize = new Sequelize("sonos",
    "artist", "gQ0WTGHCVWlJNCrpdAS8", configuration);

const dbExports = {sequelize};

function defineModel(name, columns) {
    Object.values(columns).forEach((column) => {
        if (column.allowNull === undefined) {
            column.allowNull = false;
        }
    });

    columns.id = {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    };

    return sequelize.define(name, columns, {
        timestamps: false
    });
}

dbExports.User = defineModel("User", {
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    }
});

function addDefaultUserAssociation(model) {
    model.belongsTo(dbExports.User, {
        foreignKey: "userId",
        targetKey: "id"
    });
}

dbExports.QueuedSong = defineModel("QueuedSong", {
    groupId: {
		type: DataTypes.STRING
    },
    uri: {
        type: DataTypes.STRING,
    },
	date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

addDefaultUserAssociation(dbExports.QueuedSong);

dbExports.PlayedSong = defineModel("PlayedSong", {
    groupId: {
		type: DataTypes.STRING
    },
    uri: {
        type: DataTypes.STRING,
    },
	name: {
		type: DataTypes.STRING
	},
	date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

addDefaultUserAssociation(dbExports.PlayedSong);

const Log = defineModel("Log", {
    action: {
        type: DataTypes.STRING(70)
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ip: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

addDefaultUserAssociation(Log);

dbExports.logAction = (req, action, data) => {
    let query = {
        action, data
    };
    
    if (req) {
        if (req.session && req.session.userId) {
            query.userId = req.session.userId;
        }
        
        query.ip = req.ip;
    }
    
    
    return Log.create(query);
};

module.exports = dbExports;