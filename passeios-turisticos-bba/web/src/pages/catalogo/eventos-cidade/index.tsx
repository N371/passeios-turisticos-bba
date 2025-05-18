import { useState, ChangeEvent, FormEvent } from "react";
import Footer from "src/components/Footer";
import comumStyles from "src/styles/comum.module.css";
import Head from "src/infra/Head";
import BotaoVoltar from "src/components/BotaoVoltar";
import CardSection from "src/components/CardSection";
import Calendario from "src/components/Calendario";
import SmsCard from "src/components/SmsCard";

export const getServerSideProps = async (context: any) => {
  const API = `${process.env.NEXT_PUBLIC_API_URL}/eventos-futuros`;
  const eventos = await fetch(API)
    .then((res) => res.json())
    .then((res) => res);

  return { props: { eventos } };
};

type Props = { eventos: [] };

export default function PaginaEventos({ eventos }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    consentimento: false,
  });
  const [formMessage, setFormMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.consentimento) {
      setFormMessage({
        text: "Você deve concordar em receber SMS",
        isError: true,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: true,
        }),
      });

      if (response.ok) {
        setFormMessage({
          text: "Cadastro realizado com sucesso!",
          isError: false,
        });
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          consentimento: false,
        });
        setTimeout(() => setShowForm(false), 2000);
      } else {
        throw new Error("Falha no cadastro");
      }
    } catch (error) {
      setFormMessage({
        text: "Erro ao cadastrar. Tente novamente.",
        isError: true,
      });
    }
  };

  return (
    <>
      <Head title="Eventos | Passeios Turísticos de Borborema" />
      <main className={comumStyles.mainContainer}>
        <BotaoVoltar href="/" />
        <section className={comumStyles.introSection}>
          <h1 className={comumStyles.introTitulo}>Eventos</h1>
          <p className={comumStyles.introDescricao}>
            Aqui você encontra uma lista de eventos em Borborema e região.
          </p>
        </section>

        <SmsCard 
          onClick={() => {
            setShowForm(!showForm);
            setFormMessage(null);
          }}
          titulo="Cadastre seu Telefone"
          descricao="Cadastre seu telefone para receber notícias dos eventos por SMS diretamente em seu celular"
        />

        {showForm && (
          <div className={comumStyles.cardContainer} style={{ marginTop: "20px" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Nome*</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Telefone*</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "8px" }}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="consentimento"
                  id="consentimento"
                  checked={formData.consentimento}
                  onChange={handleInputChange}
                  style={{ marginRight: "8px" }}
                />
                <label htmlFor="consentimento" style={{ cursor: "pointer" }}>
                  Concordo em receber mensagens SMS
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  type="submit" 
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#b00000",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    flex: 1
                  }}
                >
                  Cadastrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormMessage(null);
                  }}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    flex: 1
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>

            {formMessage && (
              <div style={{
                marginTop: "15px",
                padding: "10px",
                backgroundColor: formMessage.isError ? "#ffebee" : "#e8f5e9",
                color: formMessage.isError ? "#c62828" : "#2e7d32",
                borderRadius: "4px",
                textAlign: "center"
              }}>
                {formMessage.text}
              </div>
            )}
          </div>
        )}

        <Calendario />
        <CardSection itens={eventos} />
      </main>
      <Footer />
    </>
  );
}
