const { Sequelize, DataTypes, Model } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "db.sqlite"),
});

class User extends Model {}

User.init(
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "User",
    }
);

class journalRecord extends Model {}

journalRecord.init(
    {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        entry: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "journalRecord",
    }
);

journalRecord.belongsTo(User, {foreignKey: "UserId"})
User.hasMany(journalRecord)


sequelize.sync();

module.exports = { sequelize, User, journalRecord };
