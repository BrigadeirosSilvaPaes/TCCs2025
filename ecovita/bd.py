from sqlalchemy import (
    create_engine, Column, Integer, String, Float, Text,
    Date, DateTime, Enum, ForeignKey
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime, date

# ==============================
# Configuração do Banco
# ==============================
engine = create_engine("sqlite:///ecovita.db", echo=False)
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

# ==============================
# Tabelas
# ==============================

class Teste(Base):
    __tablename__ = "testes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    data_inicio = Column(Date, default=date.today)
    descricao = Column(String(255))
    data_fim = Column(Date, nullable=True)
    status = Column(Enum("em andamento", "concluído", "cancelado", name="status_enum"), default="em andamento")
    nome_experimento = Column(String(100))

    # Relacionamentos
    composteira_dados = relationship("ComposteiraDado", back_populates="teste", cascade="all, delete-orphan")
    resultados_ml = relationship("MLResultado", back_populates="teste", cascade="all, delete-orphan")
    site_dados = relationship("SiteDado", back_populates="teste", cascade="all, delete-orphan")
    leituras_sensor = relationship("SensorLeitura", back_populates="teste", cascade="all, delete-orphan")


class ComposteiraDado(Base):
    __tablename__ = "composteira_dados"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_teste = Column(Integer, ForeignKey("testes.id", ondelete="SET NULL"), nullable=True)
    registro_em = Column(DateTime, default=datetime.utcnow)
    tipo_cov = Column(String(100))
    ppm = Column(Float)
    temperatura_c = Column(Float)
    umidade_relativa = Column(Float)
    ph = Column(Float)
    presenca_chorume = Column(Enum("sim", "não", "desconhecido", name="chorume_enum"))

    teste = relationship("Teste", back_populates="composteira_dados")


class SiteDado(Base):
    __tablename__ = "site_dados"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_teste = Column(Integer, ForeignKey("testes.id", ondelete="SET NULL"), nullable=True)
    composto_verde = Column(String(100))
    peso_verde_kg = Column(Float)
    composto_marrom = Column(String(100))
    peso_marrom_kg = Column(Float)
    temp_alvo_c = Column(Float)
    umidade_alvo_pct = Column(Float)
    data_registro = Column(DateTime, default=datetime.utcnow)

    teste = relationship("Teste", back_populates="site_dados")


class MLResultado(Base):
    __tablename__ = "ml_resultados"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_teste = Column(Integer, ForeignKey("testes.id", ondelete="SET NULL"), nullable=True)
    composto_verde_toxico = Column(String(100))
    composto_marrom_toxico = Column(String(100))
    toxicidade_geral = Column(Enum("baixa", "moderada", "alta", name="toxicidade_enum"))
    covs_predominantes = Column(Text)
    melhor_composto_verde = Column(String(100))
    melhor_composto_marrom = Column(String(100))
    recomendacao = Column(Text)
    dupla_atoxica = Column(String(200))
    dupla_toxica = Column(String(200))
    data_registro = Column(DateTime, default=datetime.utcnow)

    teste = relationship("Teste", back_populates="resultados_ml")


class SensorLeitura(Base):
    __tablename__ = "sensor_leituras"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_teste = Column(Integer, ForeignKey("testes.id", ondelete="SET NULL"), nullable=True)
    temperatura = Column(Float)
    umidade = Column(Float)
    o2 = Column(Float)
    ph = Column(Float)
    gases = Column(Text)  # Ex: '{"NH3": 10, "CH4": 5}' (serializado como JSON)
    data_registro = Column(DateTime, default=datetime.utcnow)

    teste = relationship("Teste", back_populates="leituras_sensor")
    resultado_ml3 = relationship("ML3Resultado", back_populates="leitura", uselist=False, cascade="all, delete-orphan")


class ML3Resultado(Base):
    __tablename__ = "ml3_resultados"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_leitura = Column(Integer, ForeignKey("sensor_leituras.id", ondelete="CASCADE"), nullable=False)
    fase_predita = Column(Enum("Inicial", "Termofilica", "Maturacao", name="fase_enum"))
    prob_fase_inicial = Column(Float)
    prob_fase_termofilica = Column(Float)
    prob_fase_maturacao = Column(Float)
    score_coerencia = Column(Float)
    data_analise = Column(DateTime, default=datetime.utcnow)

    leitura = relationship("SensorLeitura", back_populates="resultado_ml3")

# ==============================
# Inicialização do Banco
# ==============================
def init_db():
    Base.metadata.create_all(engine)

if __name__ == "__main__":
    init_db()
    print("✅ Banco de dados inicializado com sucesso!")
