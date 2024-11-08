import React, { useState, useEffect } from 'react';
import { Container, Snackbar, Alert, Button } from '@mui/material';
import GrilleMot from './grillemots';
import { obtenirMotAleatoire, listeMots } from '../utils/mots';
import Clavier from './clavier';

const Jeu: React.FC = () => {
  const [motCible, setMotCible] = useState<string>('');
  const [essais, setEssais] = useState<string[]>([]);
  const [essaiCourant, setEssaiCourant] = useState<string>('');
  const [finPartie, setFinPartie] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    severity: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    setMotCible(obtenirMotAleatoire());
  }, []);

  useEffect(() => {
    if (essais.length > 0) {
      verifierDernierEssai();
    }
  }, [essais]);

  const verifierDernierEssai = () => {
    const dernierEssai = essais[essais.length - 1];
    if (dernierEssai === motCible) {
      setFinPartie(true);
      setMessage({
        text: 'Félicitations ! Vous avez trouvé le mot !',
        severity: 'success',
      });
      //TL fait que le jeu arrete apres 5 essaies
    } else if (essais.length >= 5) {
      setFinPartie(true);
      setMessage({
        text: `Dommage ! Le mot était "${motCible}".`,
        severity: 'error',
      });
    }
  };

  const handleSoumettreEssai = () => {
    if (essaiCourant.length !== 5) {
      setMessage({
        text: 'Le mot doit comporter 5 lettres.',
        severity: 'error',
      });
      return;
    }
    //TL ajout d'une fonction qui verifie si le mot est dans la liste
    var motTrouve = false;
    listeMots.forEach(mot => {
      if(!motTrouve){
        if(mot.normalize("NFD").replace(/[\u0300-\u036f]/g, "") == essaiCourant){
          motTrouve = true;
        }
      }
    });

    if (!motTrouve) {
      setMessage({
        text: "Ce mot n'est pas dans la liste.",
        severity: 'error',
      });
      return;
    }
    setEssais([...essais, essaiCourant.toUpperCase()]);
    setEssaiCourant('');
  };

  //TL ajout fonction recommencer
  function recommencer(): void {
    window.location.reload();
  }
//TL ajout bouton recommencer
  return (
    <Container maxWidth="sm">
      <GrilleMot
        essais={essais}
        motCible={motCible}
        essaiCourant={essaiCourant}
      />
      <Clavier
        essaiCourant={essaiCourant}
        setEssaiCourant={setEssaiCourant}
        onEnter={handleSoumettreEssai}
        inactif={finPartie}
      />
      <Button variant="contained" onClick={recommencer} sx={{ marginTop: 2}}>
        Redemarer la partie
      </Button>
      {message && (
        <Snackbar open autoHideDuration={6000} onClose={() => setMessage(null)}>
          <Alert
            onClose={() => setMessage(null)}
            severity={message.severity}
            sx={{ width: '100%' }}
          >
            {message.text}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Jeu;
