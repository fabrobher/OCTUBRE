import { Sequelize } from 'sequelize'
import { Order, Product, ProductCategory, Restaurant, RestaurantCategory, sequelizeSession } from '../models/models.js'
const indexRestaurant = async function (req, res) {
  try {
    const products = await Product.findAll({
      where: {
        restaurantId: req.params.restaurantId
      },
      include: [
        {
          model: ProductCategory,
          as: 'productCategory'
        }]
    })
    res.json(products)
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async function (req, res) {
  // Only returns PUBLIC information of products
  try {
    const product = await Product.findByPk(req.params.productId, {
      include: [
        {
          model: ProductCategory,
          as: 'productCategory'
        }]
    }
    )
    res.json(product)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async function (req, res) {
  let newProduct = Product.build(req.body)
  try {
    newProduct = await newProduct.save()
    res.json(newProduct)
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async function (req, res) {
  try {
    await Product.update(req.body, { where: { id: req.params.productId } })
    const updatedProduct = await Product.findByPk(req.params.productId)
    res.json(updatedProduct)
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    const result = await Product.destroy({ where: { id: req.params.productId } })
    let message = ''
    if (result === 1) {
      message = 'Sucessfuly deleted product id.' + req.params.productId
    } else {
      message = 'Could not delete product.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}

const toPromote = async function (req, res) {
  const t = await sequelizeSession.transaction()
  try {
    // Busco a ver si hay un producto que YA ESTE PROMOCIONADO
    const existingPromotedProduct = await Product.findOne(
      { where: { esPromocionado: true } })

    // SI EXISTE UN PRODUCTO PROMOCIONADO
    if (existingPromotedProduct) {
      // DESPROMOCIONO EL PRODUCTO promocionado
      await Product.update(
        { esPromocionado: false },
        { where: { id: existingPromotedProduct.id }, transaction: t }
      )
    }

    // PROMOCIONO EL PRODUCTO NUEVO QUE QUIERO promocionar
    // lo promocionamos buscando su id

    await Product.update(
      { esPromocionado: true },
      { where: { id: req.params.productId }, transaction: t }
    )
    await t.commit()

    // buscamos ese producto promocionado nuevo por su ID
    // mencionada ANTERIORMENTE
    const productoActualizado = await Product.findByPk(req.params.productId)

    // lo metemos al json
    res.json(productoActualizado)
  } catch (err) {
    await t.rollback()
    res.status(500)
  }
}

const popular = async function (req, res) {
  try {
    const topProducts = await Product.findAll(
      {
        include: [{
          model: Order,
          as: 'orders',
          attributes: []
        },
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'restaurantCategoryId'],
          include:
        {
          model: RestaurantCategory,
          as: 'restaurantCategory'
        }
        }
        ],
        attributes: {
          include: [
            [Sequelize.fn('SUM', Sequelize.col('orders.OrderProducts.quantity')), 'soldProductCount']
          ],
          separate: true
        },
        group: ['orders.OrderProducts.productId'],
        order: [[Sequelize.col('soldProductCount'), 'DESC']]
      // limit: 3 //this is not supported when M:N associations are involved
      })
    res.json(topProducts.slice(0, 3))
  } catch (err) {
    res.status(500).send(err)
  }
}

const ProductController = {
  indexRestaurant,
  show,
  create,
  update,
  destroy,
  toPromote,
  popular
}
export default ProductController
