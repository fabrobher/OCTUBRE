module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Perfomances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      group: {
        allowNull: false,
        type: Sequelize.STRING
      },
      appointment: {
        type: Sequelize.DATE,
        allowNull: false
      },
      restaurantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Restaurants'
          },
          key: 'id'
        },
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Performances')
  }
}
