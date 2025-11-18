from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from banco import SessionLocal, SiteDado, SensorLeitura, init_db
from datetime import datetime

app = FastAPI(title="Ecovita API")

# ----------------------
# DEPENDÊNCIA DO BANCO
# ----------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def startup():
    init_db()  # Cria tabelas se não existirem

# ----------------------
# ROTAS DO SITE
# ----------------------
@app.get("/site_dados")
def listar_site_dados(db: Session = Depends(get_db)):
    return db.query(SiteDado).all()

@app.post("/site_dados")
def inserir_site_dado(dado: dict, db: Session = Depends(get_db)):
    novo = SiteDado(
        composto_verde=dado["composto_verde"],
        peso_verde_kg=dado["peso_verde_kg"],
        composto_marrom=dado["composto_marrom"],
        peso_marrom_kg=dado["peso_marrom_kg"],
        temp_alvo_c=dado["temp_alvo_c"],
        umidade_alvo_pct=dado["umidade_alvo_pct"],
        data_registro=datetime.now()
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)

    # Roda ML-1 (toxicidade)
    ml1_res = prever_toxicidade(novo, db)

    return {"inserido": novo, "ml1_resultado": ml1_res}

# ----------------------
# ROTAS DO ESP32
# ----------------------
@app.post("/esp32/leitura")
def receber_leitura(dado: dict, db: Session = Depends(get_db)):
    """
    Espera JSON do ESP32 no formato:
    {
        "temperatura": 25.5,
        "umidade": 60,
        "o2": 20.5,
        "ph": 6.8,
        "gases": {"NH3":10,"CH4":3}
    }
    """
    nova = SensorLeitura(
        temperatura=dado["temperatura"],
        umidade=dado["umidade"],
        o2=dado.get("o2", 0.0),
        ph=dado.get("ph", 7.0),
        gases=dado.get("gases", {}),
        data_registro=datetime.now()
    )
    db.add(nova)
    db.commit()
    db.refresh(nova)

    # Roda ML-2 (perfil de gases)
    ml2_res = prever_gases(nova, db)

    # Roda ML-3 (coerência de contexto)
    ml3_res = validar_contexto(nova, ml2_res, db)

    return {
        "leitura": nova,
        "ml2_resultado": ml2_res,
        "ml3_validacao": ml3_res
    }

@app.get("/esp32/leitura")
def listar_leituras(db: Session = Depends(get_db)):
    return db.query(SensorLeitura).all()

# ----------------------
# ROTAS DE RESULTADOS ML
# ----------------------
@app.get("/ml_resultados")
def listar_resultados(db: Session = Depends(get_db)):
    return db.query(MLResultado).all()
