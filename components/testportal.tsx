import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

enum InputMethod {
  MANUAL = 'manual',
  PDF = 'pdf',
}

const TestPage: React.FC = () => {
  const [selectedInputMethod, setSelectedInputMethod] = useState<InputMethod>(InputMethod.PDF); // Set default to PDF
  const [numQuestions, setNumQuestions] = useState<number>(1);
  const [questions, setQuestions] = useState<{ question: string, options: string[] }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showNumQuestionsInput, setShowNumQuestionsInput] = useState(true);
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleManualSubmit = () => {
    console.log('Manual Answers:', questions);
  };

  const handlePDFSubmit = () => {
    console.log('Selected file:', selectedFile);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedInputMethod(event.target.value as InputMethod);
    setShowNumQuestionsInput(event.target.value === InputMethod.MANUAL);
    setShowAddQuestion(event.target.value === InputMethod.MANUAL);
  };

  const handleAddQuestion = () => {
    setNumQuestions(numQuestions + 1);
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
      }
    ]);
  };

  return (
    <Box width={800} mx="auto" p={4} border="0.5px solid grey" borderRadius={4}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>Create Test</h1>
      </div>
      <Box mb={2}>
        <RadioGroup
          aria-label="inputMethod"
          defaultValue={InputMethod.PDF} // Set default value to PDF
          value={selectedInputMethod}
          onChange={handleRadioChange}
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
      {selectedInputMethod === InputMethod.MANUAL && showAddQuestion && (
        <Box>
          {questions.map((question, index) => (
            <Box key={index} mb={4}>
              <TextField
                id={`question-${index}`}
                label={`Question ${index + 1}`}
                variant="outlined"
                value={question.question}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
              <br />
              <br />
              <Grid container spacing={2}>
                {[...Array(4).keys()].map((optionIndex) => (
                  <Grid item xs={3} key={optionIndex}>
                    <TextField
                      id={`option-${index}-${optionIndex}`}
                      label={`Option ${optionIndex + 1}`}
                      variant="filled"
                      value={question.options[optionIndex]}
                      onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
          <Button variant="contained" onClick={handleAddQuestion} style={{ marginRight: '10px' }}>Add Question</Button>
          <Button variant="contained" onClick={handleManualSubmit}>Submit</Button>
        </Box>
      )}
      {selectedInputMethod === InputMethod.PDF && (
        <div>
          <h2>Upload PDF</h2>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <Button  variant="contained" onClick={handlePDFSubmit} disabled={!selectedFile}>Submit</Button>
        </div>
      )}
    </Box>
  );
};

export default TestPage;
