import { destroy, get, patch, post, put } from './helpers/ApiRequestsHelper'

function getDetail (id) {
  return get(`products/${id}`)
}

function getProductCategories () {
  return get('productCategories')
}

function create (data) {
  return post('/products/', data)
}

function update (id, data) {
  return put(`products/${id}`, data)
}

function remove (id) {
  return destroy(`products/${id}`)
}

function toPromote (id) {
  return patch(`products/${id}/promote`)
}

export { create, getDetail, getProductCategories, remove, toPromote, update }
