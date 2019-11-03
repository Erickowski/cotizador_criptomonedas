import React,{Component} from 'react';
import axios from 'axios';
import Criptomoneda from './Criptomoneda';
import Error from './Error';

export default class Formulario extends Component {

    state = {
        criptomonedas : [],
        moneda : '',
        criptomoneda : '',
        error : false
    }

    //carga esto antes del componente
    async componentWillMount(){
        const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
        await axios.get(url)
            .then(respuesta => {
                this.setState({
                    criptomonedas : respuesta.data.Data
                })
            })
    }

    //Se ejecuta cada que el usuario elige un opcion del select
    obtenerValor = e => {
        const {name, value} = e.target;
        this.setState({
            [name] : value
        })
    }

    //Validar que el usuario elija las monedas
    cotizarMoneda = e => {
        e.preventDefault();
        const {moneda, criptomoneda} = this.state;

        //validar que haya algo en el state
        if(moneda === '' || criptomoneda === ''){
            this.setState({
                error: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        error: false
                    })
                }, 3000);
            });

            return;
        }

        //Creamos el objeto
        const cotizacion = {
            moneda,
            criptomoneda
        }

        //enviar los datos al componente App.js
        this.props.cotizarCriptomoneda(cotizacion);

    }

    render() {
        const mensaje = (this.state.error) ? <Error mensaje="Ambos campos son obligatorios" /> : '';
        return (
            <form onSubmit={this.cotizarMoneda}>
                {mensaje}
                <div className="row">
                    <label>Elige tu Moneda</label>
                    <select
                        onChange={this.obtenerValor}
                        name="moneda"
                        className="u-full-width">
                            <option value="">Elige tu moneda</option>
                            <option value="USD">Dolar Estadounidense</option>
                            <option value="MXN">Peso Mexicano</option>
                            <option value="GBP">Libras</option>
                            <option value="EUR">Euros</option>
                    </select>
                </div>

                <div className="row">
                <div>
                    <label>Elige tu Criptomoneda</label>
                    <select 
                        onChange={this.obtenerValor}
                        name="criptomoneda" 
                        className="u-full-width">
                        <option value="">Elige tu criptomoneda</option>
                        {Object.keys(this.state.criptomonedas).map(key => (
                            <Criptomoneda 
                                key={key}
                                criptomoneda={this.state.criptomonedas[key]}
                            />
                        ))}
                    </select>
                </div>
                </div>
                <input className="button-primary u-full-width" type="submit" value="Cotizar" />
            </form>
        );
    }
}