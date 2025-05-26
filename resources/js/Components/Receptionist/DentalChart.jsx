import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

// Import tooth images (you'll need to add these to your project)


const DentalChart = ({ onToothSelect, selectedTooth }) => {
  // Get the appropriate tooth image based on tooth type
  const getToothImage = (toothName) => {
    switch(toothName.toLowerCase()) {
      case "incisor": return IncisorImg;
      case "canine": return CanineImg;
      case "premolar": return PremolarImg;
      case "molar": return MolarImg;
      case "wisdom tooth": return WisdomImg;
      default: return IncisorImg;
    }
  };

  // Tooth data - FDI numbering system with image types
  const teeth = [
    // Upper right (1-8)
    { number: 18, name: 'Wisdom Tooth', quadrant: 'UR', type: 'wisdom tooth' },
    { number: 17, name: 'Molar', quadrant: 'UR', type: 'molar' },
    { number: 16, name: 'Molar', quadrant: 'UR', type: 'molar' },
    { number: 15, name: 'Premolar', quadrant: 'UR', type: 'premolar' },
    { number: 14, name: 'Premolar', quadrant: 'UR', type: 'premolar' },
    { number: 13, name: 'Canine', quadrant: 'UR', type: 'canine' },
    { number: 12, name: 'Incisor', quadrant: 'UR', type: 'incisor' },
    { number: 11, name: 'Incisor', quadrant: 'UR', type: 'incisor' },
    
    // Upper left (9-16)
    { number: 21, name: 'Incisor', quadrant: 'UL', type: 'incisor' },
    { number: 22, name: 'Incisor', quadrant: 'UL', type: 'incisor' },
    { number: 23, name: 'Canine', quadrant: 'UL', type: 'canine' },
    { number: 24, name: 'Premolar', quadrant: 'UL', type: 'premolar' },
    { number: 25, name: 'Premolar', quadrant: 'UL', type: 'premolar' },
    { number: 26, name: 'Molar', quadrant: 'UL', type: 'molar' },
    { number: 27, name: 'Molar', quadrant: 'UL', type: 'molar' },
    { number: 28, name: 'Wisdom Tooth', quadrant: 'UL', type: 'wisdom tooth' },
    
    // Lower left (17-24)
    { number: 38, name: 'Wisdom Tooth', quadrant: 'LL', type: 'wisdom tooth' },
    { number: 37, name: 'Molar', quadrant: 'LL', type: 'molar' },
    { number: 36, name: 'Molar', quadrant: 'LL', type: 'molar' },
    { number: 35, name: 'Premolar', quadrant: 'LL', type: 'premolar' },
    { number: 34, name: 'Premolar', quadrant: 'LL', type: 'premolar' },
    { number: 33, name: 'Canine', quadrant: 'LL', type: 'canine' },
    { number: 32, name: 'Incisor', quadrant: 'LL', type: 'incisor' },
    { number: 31, name: 'Incisor', quadrant: 'LL', type: 'incisor' },
    
    // Lower right (25-32)
    { number: 41, name: 'Incisor', quadrant: 'LR', type: 'incisor' },
    { number: 42, name: 'Incisor', quadrant: 'LR', type: 'incisor' },
    { number: 43, name: 'Canine', quadrant: 'LR', type: 'canine' },
    { number: 44, name: 'Premolar', quadrant: 'LR', type: 'premolar' },
    { number: 45, name: 'Premolar', quadrant: 'LR', type: 'premolar' },
    { number: 46, name: 'Molar', quadrant: 'LR', type: 'molar' },
    { number: 47, name: 'Molar', quadrant: 'LR', type: 'molar' },
    { number: 48, name: 'Wisdom Tooth', quadrant: 'LR', type: 'wisdom tooth' },
  ];

  return (
    <ChartContainer>
      <UpperJaw>
        {teeth.filter(t => t.quadrant === 'UR' || t.quadrant === 'UL').map(tooth => (
          <Tooth
            key={tooth.number}
            tooth={tooth}
            selected={selectedTooth === tooth.number.toString()}
            onClick={() => onToothSelect(tooth.number.toString())}
            image={getToothImage(tooth.type)}
          />
        ))}
      </UpperJaw>
      
      <LowerJaw>
        {teeth.filter(t => t.quadrant === 'LR' || t.quadrant === 'LL').map(tooth => (
          <Tooth
            key={tooth.number}
            tooth={tooth}
            selected={selectedTooth === tooth.number.toString()}
            onClick={() => onToothSelect(tooth.number.toString())}
            image={getToothImage(tooth.type)}
            lower
          />
        ))}
      </LowerJaw>
    </ChartContainer>
  );
};

// Styled Components
const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const Jaw = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const UpperJaw = styled(Jaw)`
  margin-bottom: 10px;
`;

const LowerJaw = styled(Jaw)`
  margin-top: 10px;
`;

const ToothContainer = styled(motion.div)`
  width: 50px;
  height: 80px;
  background-color: ${props => props.selected ? 'rgba(0, 19, 165, 0.2)' : 'transparent'};
  border-radius: ${props => props.lower ? '0 0 15px 15px' : '15px 15px 0 0'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${props => props.lower ? 'flex-start' : 'flex-end'};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.selected ? '#0013a5' : '#e0e0e0'};
`;

const ToothImage = styled.div`
  width: 100%;
  height: 70px;
  background-image: url(${props => props.image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  filter: ${props => props.selected ? 'brightness(0.9)' : 'none'};
`;

const ToothNumber = styled.span`
  font-weight: bold;
  font-size: 12px;
  color: ${props => props.selected ? '#0013a5' : '#2c3e50'};
  z-index: 2;
  margin: ${props => props.lower ? '5px 0 0' : '0 0 5px'};
  background: white;
  padding: 2px 6px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
`;

const Tooth = ({ tooth, selected, onClick, image, lower = false }) => {
  return (
    <ToothContainer
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      selected={selected}
      onClick={onClick}
      lower={lower}
    >
      {!lower && <ToothNumber selected={selected}>{tooth.number}</ToothNumber>}
      <ToothImage image={image} selected={selected} />
      {lower && <ToothNumber selected={selected}>{tooth.number}</ToothNumber>}
    </ToothContainer>
  );
};

export default DentalChart;