'use client';

import { useState } from 'react';
import { CalculationStep } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import MatrixDisplay from './MatrixDisplay';
import VectorDisplay from './VectorDisplay';

interface StepByStepProps {
  steps: CalculationStep[];
}

export default function StepByStep({ steps }: StepByStepProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Handle edge case: no steps
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center text-gray-500 font-mono py-8">
        Aucune étape de calcul disponible
      </div>
    );
  }

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step counter */}
      <div className="text-center">
        <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
          <span className="font-mono text-green-400 font-semibold">
            Étape {currentStep + 1} sur {steps.length}
          </span>
        </div>
      </div>

      {/* Step content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Step description */}
          <div className="text-center px-2">
            <h3 className="text-lg font-mono text-green-400 font-semibold break-words">
              {step.description}
            </h3>
          </div>

          {/* Step content based on type */}
          <div className="bg-black/30 border border-green-500/30 rounded-lg p-6">
            {step.type === 'vector_conversion' && (
              <VectorConversionStep step={step} />
            )}
            
            {step.type === 'matrix_multiplication' && (
              <MatrixMultiplicationStep step={step} />
            )}
            
            {step.type === 'modulo_operation' && (
              <ModuloOperationStep step={step} />
            )}
            
            {step.type === 'inverse_calculation' && (
              <InverseCalculationStep step={step} />
            )}
          </div>

          {/* Intermediate steps with staggered animation */}
          {step.intermediateSteps && step.intermediateSteps.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-mono text-green-400/70 font-semibold">
                Calculs intermédiaires :
              </h4>
              <div className="bg-black/50 border border-green-500/20 rounded-lg p-4 space-y-2">
                {step.intermediateSteps.map((intermediateStep, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="font-mono text-sm text-green-400/80"
                  >
                    {intermediateStep}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={isFirstStep}
          className={`
            flex-1 px-6 py-3 font-mono text-base font-bold rounded-lg
            border-2 transition-all
            ${isFirstStep
              ? 'bg-black/30 border-gray-600/50 text-gray-600 cursor-not-allowed'
              : 'bg-green-500/10 border-green-500 text-green-400 hover:bg-green-500/20 hover:shadow-lg hover:shadow-green-500/20'
            }
            focus:outline-none focus:ring-2 focus:ring-green-500
          `}
          aria-label="Étape précédente"
          aria-disabled={isFirstStep}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Précédent</span>
          </div>
        </button>

        <button
          onClick={handleNext}
          disabled={isLastStep}
          className={`
            flex-1 px-6 py-3 font-mono text-base font-bold rounded-lg
            border-2 transition-all
            ${isLastStep
              ? 'bg-black/30 border-gray-600/50 text-gray-600 cursor-not-allowed'
              : 'bg-green-500/10 border-green-500 text-green-400 hover:bg-green-500/20 hover:shadow-lg hover:shadow-green-500/20'
            }
            focus:outline-none focus:ring-2 focus:ring-green-500
          `}
          aria-label="Étape suivante"
          aria-disabled={isLastStep}
        >
          <div className="flex items-center justify-center gap-2">
            <span>Suivant</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

// Helper component for vector conversion steps
function VectorConversionStep({ step }: { step: CalculationStep }) {
  return (
    <div className="space-y-4">
      {step.input.text && (
        <div className="text-center">
          <div className="text-sm font-mono text-green-400/70 mb-2">Texte d'entrée :</div>
          <div className="text-2xl font-mono text-green-400 font-bold tracking-wider break-all overflow-wrap-anywhere px-2 max-h-32 overflow-y-auto">
            {step.input.text}
          </div>
        </div>
      )}
      
      {step.output.vector && (
        <div className="flex justify-center items-center gap-4 overflow-x-auto">
          <svg className="w-6 h-6 text-green-400/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <VectorDisplay 
            vector={step.output.vector} 
            label="Vecteur numérique"
            highlight={true}
            showMapping={true}
            orientation="horizontal"
          />
        </div>
      )}
    </div>
  );
}

// Helper component for matrix multiplication steps
function MatrixMultiplicationStep({ step }: { step: CalculationStep }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 overflow-x-auto">
      {step.input.matrix && (
        <MatrixDisplay 
          matrix={step.input.matrix} 
          label="Matrice de clé"
          highlight={true}
        />
      )}
      
      <div className="text-3xl font-mono text-green-400/50 flex-shrink-0">×</div>
      
      {step.input.vector && (
        <VectorDisplay 
          vector={step.input.vector} 
          label="Vecteur d'entrée"
          highlight={true}
        />
      )}
      
      <div className="text-3xl font-mono text-green-400/50 flex-shrink-0">=</div>
      
      {step.output.vector && (
        <VectorDisplay 
          vector={step.output.vector} 
          label="Vecteur de sortie"
          highlight={true}
        />
      )}
    </div>
  );
}

// Helper component for modulo operation steps
function ModuloOperationStep({ step }: { step: CalculationStep }) {
  return (
    <div className="space-y-4 text-center">
      {step.input.value !== undefined && step.output.value !== undefined && (
        <div className="flex items-center justify-center gap-4 text-xl font-mono">
          <span className="text-green-400">{step.input.value}</span>
          <span className="text-green-400/50">≡</span>
          <span className="text-green-400 font-bold">{step.output.value}</span>
          <span className="text-green-400/70">(mod 26)</span>
        </div>
      )}
      
      {step.input.vector && step.output.vector && (
        <div className="flex items-center justify-center gap-6 overflow-x-auto">
          <VectorDisplay 
            vector={step.input.vector} 
            label="Avant modulo"
          />
          <div className="text-2xl font-mono text-green-400/50 flex-shrink-0">→</div>
          <VectorDisplay 
            vector={step.output.vector} 
            label="Après modulo 26"
            highlight={true}
          />
        </div>
      )}
    </div>
  );
}

// Helper component for inverse calculation steps
function InverseCalculationStep({ step }: { step: CalculationStep }) {
  return (
    <div className="space-y-6">
      <div className="text-center text-sm font-mono text-green-400/70">
        Calcul de la matrice inverse modulo 26
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-6">
        {step.input.matrix && (
          <MatrixDisplay 
            matrix={step.input.matrix} 
            label="Matrice originale"
            highlight={true}
          />
        )}
        
        <div className="text-3xl font-mono text-green-400/50">→</div>
        
        {step.output.matrix && (
          <MatrixDisplay 
            matrix={step.output.matrix} 
            label="Matrice inverse"
            highlight={true}
          />
        )}
      </div>
      
      {step.output.matrix && step.input.matrix && (
        <div className="text-center text-xs font-mono text-green-400/60">
          Vérification : M × M⁻¹ ≡ I (mod 26)
        </div>
      )}
    </div>
  );
}
