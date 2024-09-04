import Categoria from '#models/categoria'
import Roupa from '#models/roupa'

import { createRoupaValidator, messagesRoupaProvider } from '#validators/veiculo'
import type { HttpContext } from '@adonisjs/core/http'

export default class VeiculosController {
  async index({ view }: HttpContext) {
    const roupas = await Roupa.query().preload('categoria')

    return view.render('pages/roupas/index', { roupas })
  }

  async create({ view }: HttpContext) {
    const categorias = await Categoria.all()

    return view.render('pages/roupas/create', { categorias })
  }

  async store({ request, response, session }: HttpContext) {
    const dados = request.all()

    const dadosValidos = await createRoupaValidator.validate(dados, {
      messagesProvider: messagesRoupaProvider,
    })

    const categoria = await Categoria.find(dadosValidos.categoria)

    if (!categoria) {
      session.flash('notificacao', {
        type: 'danger',
        message: `A categoria informada não encontrado!`,
      })

      return response.redirect().toRoute('roupas.index')
    }

    const roupa = await Roupa.create({
      nome: dadosValidos.nome,
      tamanho: dadosValidos.tamanho,
      preco: 200,
      quantidade: 12,
      situacao: request.input('situacao'),
    })

    await veiculo.related('categoria').associate(categoria)

    if (veiculo.$isPersisted) {
      session.flash('notificacao', {
        type: 'success',
        message: `Veículo ${veiculo.modelo} cadastrado com sucesso!`,
      })
    }

    return response.redirect().toRoute('veiculos.index')
  }

  async show({ params }: HttpContext) {}

  async edit({ params, view }: HttpContext) {
    const veiculo = await Veiculo.find(params.id)

    return view.render('pages/veiculos/create', { veiculo })
  }

  async update({ params, request, response, session }: HttpContext) {
    const veiculo = await Veiculo.find(params.id)

    if (!veiculo) {
      session.flash('notificacao', {
        type: 'danger',
        message: `Veículo informado não encontrado!`,
      })
    }

    const dados = await createVeiculoValidator.validate(request.all(), {
      messagesProvider: messagesVeiculoProvider,
    })

    await veiculo?.merge(dados).save()

    if (veiculo?.$isPersisted) {
      session.flash('notificacao', {
        type: 'warning',
        message: `Veículo ${veiculo.modelo} atualizado com sucesso!`,
      })
    }

    return response.redirect().toRoute('veiculos.index')
  }

  async destroy({ params, session, response }: HttpContext) {
    const veiculo = await Veiculo.find(params.id)

    await veiculo?.delete()

    if (veiculo?.$isDeleted) {
      session.flash('notificacao', {
        type: 'success',
        message: `Veículo excluído com sucesso!`,
      })
    }

    return response.redirect().toRoute('veiculos.index')
  }
}
