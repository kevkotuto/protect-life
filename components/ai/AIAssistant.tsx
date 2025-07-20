'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  onAnalysisComplete?: (analysis: {
    dangerType: string;
    severity: string;
    confidence: number;
    reasoning: string;
    suggestedActions: string[];
  }) => void;
  onDescriptionEnhanced?: (enhanced: string) => void;
}

export function AIAssistant({ onAnalysisComplete, onDescriptionEnhanced }: AIAssistantProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [isGettingAdvice, setIsGettingAdvice] = useState(false);

  // Analyser un signalement avec l'IA
  const handleAnalyze = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Veuillez remplir le titre et la description');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch('/api/ai/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysis(result);
        onAnalysisComplete?.(result);
      } else {
        alert('Erreur lors de l\'analyse IA');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Améliorer la description avec l'IA
  const handleEnhance = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Veuillez remplir le titre et la description');
      return;
    }

    setIsEnhancing(true);

    try {
      const response = await fetch('/api/ai/enhance-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.enhanced) {
          setDescription(result.enhanced);
          onDescriptionEnhanced?.(result.enhanced);
        }
      } else {
        alert('Erreur lors de l\'amélioration');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Obtenir des conseils de sécurité
  const handleGetAdvice = async () => {
    if (!question.trim()) {
      alert('Veuillez poser une question');
      return;
    }

    setIsGettingAdvice(true);
    setAdvice(null);

    try {
      const response = await fetch('/api/ai/safety-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      if (response.ok) {
        const result = await response.json();
        setAdvice(result.advice);
      } else {
        alert('Erreur lors de la génération des conseils');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    } finally {
      setIsGettingAdvice(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDangerTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      traffic_accident: '🚗 Accident de circulation',
      fire: '🔥 Incendie',
      medical_emergency: '🚑 Urgence médicale',
      crime: '🚨 Crime/Vol',
      natural_disaster: '🌪️ Catastrophe naturelle',
      infrastructure_issue: '🏗️ Infrastructure',
      environmental_hazard: '☣️ Danger environnemental',
      other: '⚠️ Autre'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Assistant d'analyse de signalement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Assistant IA - Analyse de signalement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre du signalement</label>
            <Textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Accident sur l'autoroute du Nord"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez la situation en détail..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              {isAnalyzing ? 'Analyse...' : 'Analyser avec IA'}
            </Button>

            <Button 
              variant="outline"
              onClick={handleEnhance} 
              disabled={isEnhancing}
              className="flex items-center gap-2"
            >
              {isEnhancing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isEnhancing ? 'Amélioration...' : 'Améliorer description'}
            </Button>
          </div>

          {/* Résultats de l'analyse */}
          {analysis && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Analyse IA terminée</span>
                <Badge variant="outline" className="text-xs">
                  {analysis.confidence}% de confiance
                </Badge>
                {analysis.fallbackMode && (
                  <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                    Mode local
                  </Badge>
                )}
              </div>

              {analysis.notice && (
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  ℹ️ {analysis.notice}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-sm text-gray-600">Type de danger :</span>
                  <div className="mt-1">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {getDangerTypeLabel(analysis.dangerType)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Gravité :</span>
                  <div className="mt-1">
                    <Badge className={getSeverityColor(analysis.severity)}>
                      {analysis.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-sm text-gray-600">Justification :</span>
                <p className="text-sm mt-1">{analysis.reasoning}</p>
              </div>

              {analysis.suggestedActions && analysis.suggestedActions.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600">Actions recommandées :</span>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {analysis.suggestedActions.map((action: string, index: number) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assistant de conseils sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-green-600" />
            Conseils de sécurité pour Abidjan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Votre question</label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Comment éviter les inondations à Koumassi ?"
              rows={3}
            />
          </div>

          <Button 
            onClick={handleGetAdvice} 
            disabled={isGettingAdvice}
            className="flex items-center gap-2"
          >
            {isGettingAdvice ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
            {isGettingAdvice ? 'Réflexion...' : 'Obtenir des conseils'}
          </Button>

          {advice && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Conseils de sécurité</span>
              </div>
              <div className="text-sm text-green-700 whitespace-pre-line">
                {advice}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 