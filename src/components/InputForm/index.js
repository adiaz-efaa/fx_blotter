import React from "react"
import '../../index2.css'

const InputForm = (props) => {
  console.log('input')
  console.log(props)
  const {handleChange, handleSubmit, inputForm} = {...props}
  const {cliente, cv, monto, precio} = {...inputForm}
  console.log('aqui ' + inputForm)
  const trueCompra = cv === 'Compra' ? true : false
  const trueVenta = cv === 'Venta' ? true : false
  return (
    <div className='form'>
      <h2>Nueva Operación</h2>
      <form onSubmit={handleSubmit}>
        <input id='cliente' placeholder='Cliente' onChange={handleChange} value={cliente}/>
        <select id='cv' name='C / V' onChange={handleChange}>
          <option value="compra" selected={trueCompra}>Compra</option>
          <option value="venta" selected={trueVenta}>Venta</option>
        </select>
        <input id='monto' placeholder='Monto' onChange={handleChange} value={monto}/>
        <input id='precio' placeholder='precio' onChange={handleChange} value={precio}/>
        <input id='btnSubmit' type="submit" value="Agregar" onChange={handleChange} />
      </form>
    </div>
    )
}

export default InputForm
