

const sumaCompras = (acum, op) => {
  if (op.cv === 'Compra') {
    return acum + op.monto
  } else {
    return acum
  }
}

const comprasPonderadas = (acum, op) => {
  if (op.cv === 'Compra') {
    return acum + op.monto * op.precio
  } else {
    return acum
  }
}

const ventasPonderadas = (acum, op) => {
  if (op.cv === 'Venta') {
    return acum + op.monto * op.precio
  } else {
    return acum
  }
}

const sumaVentas = (acum, op) => {
  if (op.cv === 'Compra') {
    return acum
  } else {
    return acum + op.monto
  }
}

const initialState = {
  fecha: '2019-05-28',
  bid: 700.00,
  ask: 700.30,
  ops: {
    1: {numop: 1, cliente: 'Santander', fxrate: 'USDCLP', cv: 'Compra', monto: 1000000, precio: 700, editable: false},
    2: {numop: 2, cliente: 'Estado', fxrate: 'USDCLP', cv: 'Venta', monto: 3000000, precio: 701, editable: false},
    3: {numop: 3, cliente: 'Estado', fxrate: 'USDCLP', cv: 'Venta', monto: 3000000, precio: 702, editable: false},
    4: {numop: 4, cliente: 'Estado', fxrate: 'USDCLP', cv: 'Compra', monto: 1000000, precio: 701, editable: false},
  },
  nextNumop: 5,
  inputForm: {cliente: '',  cv: 'Compra', monto: '', precio: ''},
  getOpsArray: function() {
    return Object.keys(this.ops).map(key => this.ops[key])
  },
  getCompras: function() {
    const opArr = Object.keys(this.ops).map(key => this.ops[key])
    return opArr.reduce(sumaCompras, 0)
  },
  getPpcompra: function() {
    const opsArray = Object.keys(this.ops).map(key => this.ops[key])
    const compras = opsArray.reduce(sumaCompras, 0)
    const compPond = opsArray.reduce(comprasPonderadas, 0)
    return compras > 0 ? Math.round(compPond / compras * 100.0) / 100.0 : 0
  },
  getVentas: function() {
  const opArr = Object.keys(this.ops).map(key => this.ops[key])
  return opArr.reduce(sumaVentas, 0)
},
  getPpventa: function() {
    const opsArray = Object.keys(this.ops).map(key => this.ops[key])
    const ventas = opsArray.reduce(sumaVentas, 0)
    const ventPond = opsArray.reduce(ventasPonderadas, 0)
    return ventas > 0 ? Math.round(ventPond / ventas * 100.0) / 100.0 : 0
  },

  getResTrading: function() {
    const opsArray = Object.keys(this.ops).map(key => this.ops[key])
    const compras = opsArray.reduce(sumaCompras, 0)
    const compPond = opsArray.reduce(comprasPonderadas, 0)
    const ppcompra =  compras > 0 ? compPond / compras : 0
    const ventas = opsArray.reduce(sumaVentas, 0)
    const ventPond = opsArray.reduce(ventasPonderadas, 0)
    const ppventa = ventas > 0 ? ventPond / ventas : 0
    return Math.round(Math.min(compras, ventas) * (ppventa - ppcompra))
  },
  getResPos: function(bid, ask) {
    const opsArray = Object.keys(this.ops).map(key => this.ops[key])
    const compras = opsArray.reduce(sumaCompras, 0)
    const compPond = opsArray.reduce(comprasPonderadas, 0)
    const ppcompra =  compras > 0 ? compPond / compras : 0
    const ventas = opsArray.reduce(sumaVentas, 0)
    const ventPond = opsArray.reduce(ventasPonderadas, 0)
    const ppventa = ventas > 0 ? ventPond / ventas : 0
    const posicion = compras - ventas
    return Math.round(posicion > 0 ? posicion * (bid - ppcompra) : - posicion * (ppventa - ask))
  }
}

const update = (state = initialState, action) => {
  if (action.type === 'PUNTA') {
    return {...state, bid: action.bid, ask: action.ask}
  }

  if (action.type === 'ELIM_OP') {
    // eslint-disable-next-line no-restricted-globals
    const sure = confirm('¿Está seguro de eliminar la operación ' + action.whichOp + '?')
    if (!sure) {
      return state
    }
    const whichOp = parseInt(action.whichOp)
    const newOpsKeys = Object.keys(state.ops).filter(key => state.ops[key].numop !== whichOp)
    let newOps = {}
    for (let key in state.ops) {
      if (newOpsKeys.includes(key)) {
        newOps[key] = state.ops[key]
      }
    }
    return {...state, ops: newOps}
  }

  if (action.type === 'EDIT_OP') {
    const whichOp = parseInt(action.whichOp)
    const editable = state.ops[whichOp].editable
    return {...state, ops: {...state.ops, [whichOp]: {...state.ops[whichOp], editable: !editable}}}
  }

  if (action.type === 'EDIT_CELDA') {
    const celda = action.whichCellOp.slice(0, 2)
    const prop = {'cl': 'cliente', 'fx': 'fxrate', 'cv': 'cv', 'mn': 'monto', 'pr': 'precio'}
    const op = action.whichCellOp.slice(3)
    const value = Number(action.newValue)
    //alert(value)
    return {...state, ops: {...state.ops, [op]: {...state.ops[op], [prop[celda]]: value}}}
  }

  if (action.type === 'UPDATE_FORM_FIELD') {
    const campo = action.whichField
    let valor // Declared but not initialized
    if (campo === 'monto') {
      valor = action.newValue.replace(/\D/,'')
    } else {
      valor = action.newValue
    }
    const newState = {...state, inputForm: {...state.inputForm, [campo]: valor}}
    return newState
  }

  if (action.type === 'SUBMIT_FORM') {
    const newState = {...state,
      ops: {...state.ops,
        [state.nextNumop]: { numop: state.nextNumop,
          cliente: state.inputForm.cliente,
          fxrate: 'USDCLP',
          cv: state.inputForm.cv,
          monto: parseInt(state.inputForm.monto),
          precio: parseFloat(state.inputForm.precio),
          editable: false},
      },
      nextNumop: state.nextNumop + 1
    }

    return newState
  }

  return state
}

export default update