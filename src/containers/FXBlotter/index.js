import React from 'react'
import { connect } from 'react-redux'
import InputForm from '../../components/InputForm'
import '../../index2.css'


const FXBlotter = (props) => {
  console.log('ops')
  console.log(props.ops)
  const {fecha, bid, ask, blotterStyle, headerStyle, flexH} = {...props}
  const opsArray = Object.keys(props.ops).map((key) => props.ops[key])
  console.log('ops array')
  console.log(opsArray)
  return (
    <div className='encabezado'>
      <h1>FX Blotter</h1>
      <div className={headerStyle}>
        <div className={blotterStyle}>
          <table>
            <tbody>
            <tr>
              <th>Fecha:</th>
              <td>{fecha}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className={blotterStyle}>
          <table>
            <tbody>
            <tr>
              <th>Bid:</th>
              <td>{bid.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              <th>Ask:</th>
              <td>{ask.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            </tr>
            </tbody>
          </table>
          <button className='button' type='button' onClick={props.actualizaPunta}>
            Refresca Punta
          </button>
        </div>
      </div>
      <div className={flexH}>
        <div className={blotterStyle}>
          <table>
            <tbody>
            <tr>
              <th>NumOp</th>
              <th>Cliente</th>
              <th>FX Rate</th>
              <th>C / V</th>
              <th>Monto</th>
              <th>Precio</th>
              <th>Editar</th>
            </tr>
            {opsArray.map((op) => {
              return (
                <tr>
                  <td>{op.numop}</td>
                  <td id={'cl-' + op.numop} contentEditable={op.editable} onKeyUp={props.editaCelda}>{op.cliente}</td>
                  <td id={'fx-' + op.numop} contentEditable={op.editable} onKeyUp={props.editaCelda}>{op.fxrate}</td>
                  <td id={'cv-' + op.numop} contentEditable={op.editable} onKeyUp={props.editaCelda}>{op.cv}</td>
                  <td id={'mn-' + op.numop} contentEditable={op.editable} onKeyUp={props.editaCelda}>
                    {op.monto.toLocaleString(undefined, {minimumFractionDigits: 0})}</td>
                  <td id={'pr-' + op.numop} contentEditable={op.editable} onKeyUp={props.editaCelda}>
                    {op.precio.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td>
                    <div className='button2'>
                      <button id={op.numop} type='button' onClick={props.eliminaOperacion}>
                        Eliminar
                      </button>
                      <button id={op.numop} type='button' onClick={props.editaOperacion}>
                        {op.editable ? 'Modificando' : 'Modificar'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
        <div className={blotterStyle}>
            <table>
              <tbody>
              <tr>
                <th>Posicion (USD)</th>
                <td>{(props.compras() - props.ventas()).toLocaleString(undefined)}</td>
              </tr>
              <tr>
                <th>Compras</th>
                <td>{props.compras().toLocaleString(undefined)}</td>
              </tr>
              <tr>
                <th>PProm Compra</th>
                <td>{props.ppcompra().toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              </tr>
              <tr>
                <th>Ventas</th>
                <td>{props.ventas().toLocaleString(undefined)}</td>
              </tr>
              <tr>
                <th>PProm Venta</th>
                <td>{props.ppventa().toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              </tr>
              <tr>
                <th>Res. Trading (CLP)</th>
                <td>{props.resTrading().toLocaleString(undefined)}</td>
              </tr>
              <tr>
                <th>Res. Posicion (CLP)</th>
                <td>{props.resPos(props.bid, props.ask).toLocaleString(undefined)}</td>
              </tr>
              </tbody>
            </table>
          </div>
        <InputForm handleChange={props.actualizaForma} inputForm={props.inputForm} handleSubmit={props.submitForma} />
      </div>
    </div>

  )
}

const mapStateToProps = (state) => {
  return {
    fecha: state.fecha,
    bid: state.bid,
    ask: state.ask,
    ops: state.ops,
    nextNumop: state.nextNumop,
    compras: state.getCompras,
    ppcompra: state.getPpcompra,
    ventas: state.getVentas,
    ppventa: state.getPpventa,
    resTrading: state.getResTrading,
    resPos: state.getResPos,
    inputForm: state.inputForm
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actualizaPunta: () => {
      const bid = 700.00 + Math.round(Math.random() * 100.0) / 100.0
      const ask = Math.round((bid + .30) * 100.0) / 100.0
      return dispatch({type: 'PUNTA', bid: bid, ask: ask})
    },
    eliminaOperacion: (event) => dispatch({type: 'ELIM_OP', whichOp: event.target.id}),
    editaOperacion: (event) => dispatch({type: 'EDIT_OP', whichOp: event.target.id, rest: event.target.value}),
    editaCelda: (event) => dispatch({type: 'EDIT_CELDA', whichCellOp: event.target.id, newValue: event.target.textContent}),
    actualizaForma: (event) => dispatch({type: 'UPDATE_FORM_FIELD', whichField: event.target.id, newValue: event.target.value}),
    submitForma: (event) => {event.preventDefault()
      return dispatch({type: 'SUBMIT_FORM'})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FXBlotter)