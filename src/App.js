import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

function App() {
  const [alimentos, setAlimentos] = useState([]);
  const [primeiroAlimento, setAlimento] = useState({});
  const [primeiroAlimento2, setAlimento2] = useState({});
  const [peso, setPeso] = useState();
  const [altura, setAltura] = useState();
  const [imc, setIMC] = useState();
  const [alimentosIMC, setAlimentosIMC] = useState([]);
  const [listaSession, setListaSession] = useState([]);
  const [somaCalorias, setSomaCalorias] = useState(0);
  
  const calcIMC = () => {
    if(peso && altura){
      var imc = peso / (altura*altura)
      stringIMC(imc)
      randomItems()
    }else{
      console.log('ops, prrencha todos os campos.')
    }
  }

  const stringIMC = (imc_value) => {
    const formated_value = parseFloat(imc_value.toFixed(2));
    if(formated_value < 18.5){
      setIMC('Magreza: '+formated_value);
    }
    
    if(formated_value > 18.5 && formated_value < 24.9){
      setIMC('Normal: '+formated_value);
    }
    
    if(formated_value > 24.9 && formated_value < 30){
      setIMC('Sobrepeso: '+formated_value);
    }

    if(formated_value > 30){
      setIMC('Obesidade: '+formated_value);
    }
  }

  const randomItems = () => {
    var new_array = [];
    new_array.push(alimentos[Math.floor(Math.random() * (alimentos.length - 1 + 1)) + 1]);
    new_array.push(alimentos[Math.floor(Math.random() * (alimentos.length - 1 + 1)) + 1]);
    new_array.push(alimentos[Math.floor(Math.random() * (alimentos.length - 1 + 1)) + 1]);
    new_array.push(alimentos[Math.floor(Math.random() * (alimentos.length - 1 + 1)) + 1]);
    new_array.push(alimentos[Math.floor(Math.random() * (alimentos.length - 1 + 1)) + 1]);
    setAlimentosIMC(new_array);
  }

  const setSessionAlimento = (a) => {
    setAlimento2(a);
    var new_alimentos = JSON.parse(localStorage.getItem('alimentos_session'));
    if(new_alimentos && new_alimentos.filter((alimento) => alimento.id == a.id).length > 0){
      return false;
    }

    if(new_alimentos){
      new_alimentos = [...new_alimentos, a]
    }else{
      new_alimentos = [a]
    }
    localStorage.setItem('alimentos_session', JSON.stringify(new_alimentos));
    setListaSession(new_alimentos)
    updateCalculo();
  }

  const removeFromCache = (key) => {
    var alimentos = JSON.parse(localStorage.getItem('alimentos_session'));
    alimentos = alimentos.filter((alimento, k) => k != key)
    localStorage.setItem('alimentos_session', JSON.stringify(alimentos));
    setListaSession(alimentos)
    updateCalculo();
  }

  useEffect(() => {
    axios.get(`https://taco-food-api.herokuapp.com/api/v1/food`)
    .then(res => {
      setAlimentos(res.data);
      setListaSession(JSON.parse(localStorage.getItem('alimentos_session')??[]))
      updateCalculo();
    })
  }, [])

  const updateCalculo = () => {
    var teste = 0;
    JSON.parse(localStorage.getItem('alimentos_session')).map((alimento) => {
      return teste += alimento.attributes.energy.kcal
    })
    setSomaCalorias(teste)
  }
  
  return (
    <div className="App">
      <div className="BannerMain">
        <div className="DivTitulo">FitFood</div>
      </div>
      <div className="MainBox">
        <div className="DivSubTitulo">Cada porção equivale a 100g</div>
        <div className="DivBoxAlimentos">
          <div className="DivAlimentos1">
            <div className="Alimento1">Alimento que será substituído</div>
            <div className="Select">
              {alimentos.map((a, k) => <div key={k} className={primeiroAlimento.id && a.id == primeiroAlimento.id?'divLine lineActive1':'divLine'} onClick={() => setAlimento(a)}>{a.description}</div>)}
            </div>
            <div className="DivKcal1">
              <div className="DivTitle">Calorias</div>
              {primeiroAlimento.attributes?(
                <div className="ValorCaloria">{primeiroAlimento.attributes.energy.kcal.toFixed(2)}</div>
              ):(
                <div className="ValorCaloria">0</div>
              )}
            </div>
          </div>
          
          <div className="DivAlimentos2">
          <div className="Alimento2">Alimento substituto</div>
            <div className="Select">
              {alimentos.map((a, k) => <div key={k} className={primeiroAlimento2.id && a.id == primeiroAlimento2.id?'divLine lineActive2':'divLine'} onClick={() => setSessionAlimento(a)}>{a.description}</div>)}
            </div>
            <div className="DivKcal2">
              <div className="DivTitle">Calorias</div>
              {primeiroAlimento2.attributes?(
                <div className="ValorCaloria">{primeiroAlimento2.attributes.energy.kcal.toFixed(2)}</div>
              ):(
                <div className="ValorCaloria">0</div>
              )}
            </div>
          </div>
        </div>
        <div className="DivResultado">
          Resultado
          {primeiroAlimento2.attributes?(
            <div>
              {(primeiroAlimento2.attributes.energy.kcal - primeiroAlimento.attributes.energy.kcal) > 0?'+':''}
              {(primeiroAlimento2.attributes.energy.kcal - primeiroAlimento.attributes.energy.kcal).toFixed(2)} Calorias
            </div>
          ):(
            <div>0</div>
          )}
        </div>
      </div>
      {somaCalorias !== 0&&(
        <>
          <div className="DivTituloIMC">Items Selecionados</div>
          <table>
            <thead>
              <tr className="FundoItems">
                <th style={{width: 400, textAlign: 'left', padding: 10}}>Item</th>
                <th style={{width: 100, textAlign: 'center'}}>Calorias</th>
                <th style={{width: 100, textAlign: 'center'}}>Remover</th>
              </tr>
            </thead>
            <tbody>
              {listaSession && listaSession.map((a, k) => (
                <tr key={k} style={{backgroundColor: '#f3f3f3'}}>
                  <td style={{textAlign: 'left', padding: 10}}>{a.description}</td>
                  <td style={{textAlign: 'center'}}>{a.attributes.energy.kcal.toFixed(2)}</td>
                  <td><button className="buttonRemove" onClick={() => removeFromCache(k)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Calorias: {somaCalorias.toFixed(2)}</h4>
        </>
      )}

      <div className="DivTituloIMC">Calcular IMC</div>
      <div className="DivInputs">
        <input className="InputIMC" type="text" onChange={(e) => setPeso(e.target.value)} placeholder="Peso..."  required />
        <input className="InputIMC" type="text" onChange={(e) => setAltura(e.target.value)} placeholder="Altura..."  required />
        <button onClick={() => calcIMC()} className="ButtonIMC">Calcular</button>
      </div>
      {imc&&(
        <>
          <div className="ImgResult">
            {imc}
          </div>
          <div className="ImgResult">
            <b>Items sugeridos</b>
            <div className="mt10_sugeridos">
              {alimentosIMC.map((p, k) => <div className="mt10_sugeridos" key={k}>{p.description}</div>)}
            </div>
          </div>
        </>
      )}

      
    </div>
  );
}

export default App;
