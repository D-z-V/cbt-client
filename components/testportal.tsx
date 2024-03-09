import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Textarea from '@mui/joy/Textarea';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

enum InputMethod {
  MANUAL = 'manual',
  PDF = 'pdf',
}

interface Question {
  question: string;
  options: string[];
}

interface Section {
  name: string; 
  marks: number;
  schema: string;
  questionType: string;
  questions: Question[];
}

const TestPage: React.FC = () => {
  const [selectedInputMethod, setSelectedInputMethod] = useState<InputMethod>(InputMethod.PDF); // Set default to PDF
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAddSection, setShowAddSection] = useState(true);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [manualInstructions, setManualInstructions] = useState<string>('');
  const [pdfInstructions, setPdfInstructions] = useState<string>('');

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        name: `Section ${sections.length + 1}`,
        marks: 0,
        schema: '',
        questionType: '',
        questions: [],
      }
    ]);
  };

  const handleInputChange = (sectionIndex: number, questionIndex: number, value: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].question = value;
    setSections(newSections);
  };

  const handleOptionChange = (sectionIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].options[optionIndex] = value;
    setSections(newSections);
  };

  const handleManualSubmit = () => {
    console.log('Manual Instructions:', manualInstructions);
    console.log('Manual Answers:', sections);
  };

  const handlePDFSubmit = () => {
    console.log('PDF Instructions:', pdfInstructions);
    console.log('Selected file:', selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddQuestion = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.push({
      question: '',
      options: ['', '', '', ''],
    });
    setSections(newSections);
  };

  // Calculate the width of the box dynamically based on the number of sections
  const boxWidth = `${sections.length * 200 + 400}px`; // Adjust the multiplier and add extra padding as needed

  return (
    <Box width={boxWidth} mx="auto" p={4} border="0.5px solid #ccc" borderRadius={4} bgcolor="#f7f7f7" color="#000">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>Create Test</h1>
      </div>
      <Box mb={2}>
        <RadioGroup
          aria-label="inputMethod"
          defaultValue={InputMethod.PDF} 
          value={selectedInputMethod}
          onChange={(e) => setSelectedInputMethod(e.target.value as InputMethod)}
          row
        >
          <FormControlLabel
            value={InputMethod.MANUAL}
            control={<Radio />}
            label="Upload"
          />
          <FormControlLabel
            value={InputMethod.PDF}
            control={<Radio />}
            label="Upload PDF"
          />
        </RadioGroup>
      </Box>
      {selectedInputMethod === InputMethod.MANUAL && (
        <>
          <Textarea
            placeholder="Add instructions for manual input here..."
            value={manualInstructions}
            onChange={(e) => setManualInstructions(e.target.value)}
            rows={4}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <Tabs value={currentSection} onChange={(e, newValue) => setCurrentSection(newValue)} textColor="primary">
            {sections.map((section, index) => (
              <Tab key={index} label={section.name} />
            ))}
            <Button variant="contained" onClick={handleAddSection} style={{ marginLeft: 'auto', backgroundColor: '#4caf50', color: '#fff' }}>Add Section</Button>
          </Tabs>
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} hidden={sectionIndex !== currentSection}>
              <h2>{section.name}</h2>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <TextField
                    label="Section Name" // Add section name field
                    variant="outlined"
                    value={section.name}
                    onChange={(e) => {
                      const newSections = [...sections];
                      newSections[sectionIndex].name = e.target.value;
                      setSections(newSections);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Marks"
                    variant="outlined"
                    value={section.marks}
                    onChange={(e) => {
                      const newSections = [...sections];
                      const marks = parseInt(e.target.value);
                      newSections[sectionIndex].marks = isNaN(marks) ? 0 : marks; // Check for NaN
                      setSections(newSections);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Schema"
                    variant="outlined"
                    value={section.schema}
                    onChange={(e) => {
                      const newSections = [...sections];
                      newSections[sectionIndex].schema = e.target.value;
                      setSections(newSections);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Question Type"
                    variant="outlined"
                    value={section.questionType}
                    onChange={(e) => {
                      const newSections = [...sections];
                      newSections[sectionIndex].questionType = e.target.value;
                      setSections(newSections);
                    }}
                  />
                </Grid>
              </Grid>
              {section.questions.map((question, questionIndex) => (
                <Box key={questionIndex} mt={2}>
                  <Textarea
                    placeholder={`Question ${questionIndex + 1}...`}
                    minRows={2}
                    style={{ width: "100%" }}
                    value={question.question}
                    onChange={(e) => handleInputChange(sectionIndex, questionIndex, e.target.value)}
                  />
                  <br />
                  <Grid container spacing={2}>
                    {[...Array(4).keys()].map((optionIndex) => (
                      <Grid item xs={3} key={optionIndex}>
                        <TextField
                          id={`option-${sectionIndex}-${questionIndex}-${optionIndex}`}
                          label={`Option ${optionIndex + 1}`}
                          variant="outlined"
                          value={question.options[optionIndex]}
                          onChange={(e) => handleOptionChange(sectionIndex, questionIndex, optionIndex, e.target.value)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
              <br />
              <Button variant="contained" onClick={() => handleAddQuestion(sectionIndex)} style={{ backgroundColor: '#4caf50', color: '#fff' }}>Add Question</Button>
            </div>
          ))}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleManualSubmit} style={{ marginRight: '10px', backgroundColor: '#2196f3', color: '#fff' }}>Submit</Button>
          </Box>
        </>
      )}
      {selectedInputMethod === InputMethod.PDF && (
        <>
          <Textarea
            placeholder="Add instructions for PDF upload here..."
            value={pdfInstructions}
            onChange={(e) => setPdfInstructions(e.target.value)}
            rows={4}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <div>
            <h2>Upload PDF</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <Button variant="contained" onClick={handlePDFSubmit} disabled={!selectedFile} style={{ backgroundColor: '#2196f3', color: '#fff' }}>Submit</Button>
          </div>
        </>
      )}
    </Box>
  );
};

export default TestPage;
