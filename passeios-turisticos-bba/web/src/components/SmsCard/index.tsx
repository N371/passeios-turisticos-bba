import { FC, MouseEvent } from "react";
import styles from "./styles.module.css";

type SmsCardProps = {
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
};

const SmsCard: FC<SmsCardProps> = ({ onClick }) => (
  <div 
    className={`${styles.item} ${styles.smsCard}`} 
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick?.(e as any)}
  >
    <h2 className={styles.cardTitle}>Cadastre seu Telefone</h2>
    <p className={styles.cardDescription}>
      Cadastre seu telefone para receber notícias dos eventos por SMS diretamente em seu celular
    </p>
  </div>
);

export default SmsCard;
