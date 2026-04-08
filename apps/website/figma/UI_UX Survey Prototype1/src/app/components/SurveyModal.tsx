import { X, CheckCircle, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface SurveyModalProps {
  onClose: () => void;
}

export function SurveyModal({ onClose }: SurveyModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [answers, setAnswers] = useState({
    role: '',
    experience: '',
    navigation: '',
    design: '',
    features: [] as string[],
    usability: '',
    offline: '',
    search: '',
    improvements: '',
    priority: '',
  });

  const handleSubmit = () => {
    console.log('Survey submitted:', answers);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center">
          <div className="size-16 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="size-8" />
          </div>
          <h2 className="mb-4">Vielen Dank!</h2>
          <p className="text-muted-foreground mb-6">
            Ihre Antworten helfen uns, ResQBrain noch besser für den praktischen Einsatz zu gestalten.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Schließen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2>UI/UX Umfrage - ResQBrain</h2>
            <p className="text-sm text-muted-foreground">Seite {currentPage} von 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-destructive h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentPage / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {currentPage === 1 && (
            <div className="space-y-6">
              <Question
                number={1}
                title="Welche Rolle beschreibt Sie am besten?"
                required
              >
                <RadioGroup
                  name="role"
                  options={[
                    'Rettungssanitäter/in',
                    'Notfallsanitäter/in',
                    'Praxisanleiter/in',
                    'Ärztliche Leitung',
                    'Organisationsverantwortliche/r',
                    'Sonstiges',
                  ]}
                  value={answers.role}
                  onChange={(value) => setAnswers({ ...answers, role: value })}
                />
              </Question>

              <Question
                number={2}
                title="Wie viele Jahre Erfahrung haben Sie im Rettungsdienst?"
                required
              >
                <RadioGroup
                  name="experience"
                  options={[
                    'Weniger als 1 Jahr',
                    '1-3 Jahre',
                    '3-5 Jahre',
                    '5-10 Jahre',
                    'Mehr als 10 Jahre',
                  ]}
                  value={answers.experience}
                  onChange={(value) => setAnswers({ ...answers, experience: value })}
                />
              </Question>

              <Question
                number={3}
                title="Wie bewerten Sie die Navigation in dieser Demo?"
                required
              >
                <RadioGroup
                  name="navigation"
                  options={[
                    'Sehr intuitiv',
                    'Intuitiv',
                    'Neutral',
                    'Verwirrend',
                    'Sehr verwirrend',
                  ]}
                  value={answers.navigation}
                  onChange={(value) => setAnswers({ ...answers, navigation: value })}
                />
              </Question>
            </div>
          )}

          {currentPage === 2 && (
            <div className="space-y-6">
              <Question
                number={4}
                title="Wie gefällt Ihnen das visuelle Design?"
                required
              >
                <RadioGroup
                  name="design"
                  options={[
                    'Ausgezeichnet',
                    'Gut',
                    'Befriedigend',
                    'Ausreichend',
                    'Mangelhaft',
                  ]}
                  value={answers.design}
                  onChange={(value) => setAnswers({ ...answers, design: value })}
                />
              </Question>

              <Question
                number={5}
                title="Welche Features sind für Sie am wichtigsten? (Mehrfachauswahl)"
                required
              >
                <CheckboxGroup
                  options={[
                    'Schnelle Medikamentensuche',
                    'Algorithmen/Protokolle',
                    'Dosisrechner',
                    'Offline-Verfügbarkeit',
                    'Favoriten & Verlauf',
                    'Vitalwerte-Referenz',
                  ]}
                  values={answers.features}
                  onChange={(values) => setAnswers({ ...answers, features: values })}
                />
              </Question>

              <Question
                number={6}
                title="Wie einfach war es, die gewünschten Informationen zu finden?"
                required
              >
                <RadioGroup
                  name="usability"
                  options={[
                    'Sehr einfach',
                    'Einfach',
                    'Neutral',
                    'Schwierig',
                    'Sehr schwierig',
                  ]}
                  value={answers.usability}
                  onChange={(value) => setAnswers({ ...answers, usability: value })}
                />
              </Question>
            </div>
          )}

          {currentPage === 3 && (
            <div className="space-y-6">
              <Question
                number={7}
                title="Wie wichtig ist Ihnen die Offline-Funktionalität?"
                required
              >
                <RadioGroup
                  name="offline"
                  options={[
                    'Absolut unverzichtbar',
                    'Sehr wichtig',
                    'Wichtig',
                    'Weniger wichtig',
                    'Unwichtig',
                  ]}
                  value={answers.offline}
                  onChange={(value) => setAnswers({ ...answers, offline: value })}
                />
              </Question>

              <Question
                number={8}
                title="Wie gut funktioniert die Suchfunktion?"
                required
              >
                <RadioGroup
                  name="search"
                  options={[
                    'Ausgezeichnet',
                    'Gut',
                    'Befriedigend',
                    'Ausreichend',
                    'Habe sie nicht genutzt',
                  ]}
                  value={answers.search}
                  onChange={(value) => setAnswers({ ...answers, search: value })}
                />
              </Question>

              <Question
                number={9}
                title="Was sollten wir als nächstes verbessern?"
                required
              >
                <textarea
                  value={answers.improvements}
                  onChange={(e) => setAnswers({ ...answers, improvements: e.target.value })}
                  placeholder="Ihre Verbesserungsvorschläge..."
                  className="w-full min-h-[120px] px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-destructive resize-none"
                />
              </Question>

              <Question
                number={10}
                title="Würden Sie ResQBrain in Ihrer Organisation einsetzen?"
                required
              >
                <RadioGroup
                  name="priority"
                  options={[
                    'Ja, definitiv',
                    'Wahrscheinlich ja',
                    'Vielleicht',
                    'Wahrscheinlich nicht',
                    'Nein',
                  ]}
                  value={answers.priority}
                  onChange={(value) => setAnswers({ ...answers, priority: value })}
                />
              </Question>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Zurück
          </button>

          <div className="flex items-center gap-2">
            {currentPage < 3 ? (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Weiter
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <MessageSquare className="size-4" />
                Umfrage absenden
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuestionProps {
  number: number;
  title: string;
  required?: boolean;
  children: React.ReactNode;
}

function Question({ number, title, required, children }: QuestionProps) {
  return (
    <div>
      <label className="block mb-3">
        <span className="text-destructive mr-2">#{number}</span>
        {title}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

interface RadioGroupProps {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

function RadioGroup({ name, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="size-4 text-destructive focus:ring-destructive"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

interface CheckboxGroupProps {
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}

function CheckboxGroup({ options, values, onChange }: CheckboxGroupProps) {
  const handleToggle = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
        >
          <input
            type="checkbox"
            checked={values.includes(option)}
            onChange={() => handleToggle(option)}
            className="size-4 text-destructive focus:ring-destructive rounded"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}
