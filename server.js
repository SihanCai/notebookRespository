const jsonServer = require('json-server')
const path = require('path')
const express = require('express')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const root = __dirname + '/build'
const port = process.env.LEANCLOUD_APP_PORT || 3000

server.use(express.static(root, { maxAge: 86400000 }))
server.use(middlewares)
const reactRouterWhiteList = ['/create', '/edit/:itemId']
server.get(reactRouterWhiteList, function (request, response) {
  response.sendFile(path.resolve(root, 'index.html'))
})
server.use(router)
server.listen(port, () => {
  console.log('JSON Server is running')
})