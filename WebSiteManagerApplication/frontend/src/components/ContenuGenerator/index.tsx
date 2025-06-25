import React, { useState } from 'react';
import { Container, Typography, Tabs, Tab, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ContenuGeneratorForm } from './ContenuGeneratorForm.tsx';
import GeneratedContent from './GeneratedContent.tsx';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const ContenuGenerator: React.FC = () => {
  const { entrepriseId } = useParams<{ entrepriseId: string }>();
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleContentGenerated = (content: any) => {
    setGeneratedContent(content);
    setTabValue(1); // Switch to preview tab
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!entrepriseId) {
    return (
      <Container>
        <Typography color="error">ID de l'entreprise non spécifié</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Générateur de Contenu IA
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Générer du contenu" />
          {generatedContent && <Tab label="Aperçu" />}
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <ContenuGeneratorForm
          entrepriseId={entrepriseId}
          onContentGenerated={handleContentGenerated}
        />
      </TabPanel>

      {generatedContent && (
        <TabPanel value={tabValue} index={1}>
          <GeneratedContent content={generatedContent} />
        </TabPanel>
      )}
    </Container>
  );
}; 