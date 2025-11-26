import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader2, Info, Activity } from 'lucide-react';
import { analyzeFoodImage, fileToBase64 } from '../services/geminiService';
import { NutritionAnalysis } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']; // Blue (Protein), Green (Carbs), Orange (Fat)

export const ScannerView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
      setLoading(true);

      try {
        const base64 = await fileToBase64(file);
        const result = await analyzeFoodImage(base64, file.type);
        setAnalysis(result);
      } catch (err) {
        console.error(err);
        setError("Error al analizar la imagen. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const chartData = analysis ? [
    { name: 'Proteína', value: analysis.protein },
    { name: 'Carbohidratos', value: analysis.carbs },
    { name: 'Grasa', value: analysis.fat },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Escáner Nutricional</h2>
        <p className="text-gray-600">Sube una foto de tu plato para obtener un desglose instantáneo de calorías y macros.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <div 
            onClick={triggerUpload}
            className={`border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${imagePreview ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'}`}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-2xl" />
            ) : (
              <div className="text-center p-6">
                <div className="bg-emerald-100 p-4 rounded-full inline-flex mb-4">
                  <Camera className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-lg font-medium text-gray-700">Toma una foto o sube un archivo</p>
                <p className="text-sm text-gray-500 mt-2">Soporta JPG y PNG</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          {loading && (
            <div className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mr-3" />
              <span className="text-gray-600">Analizando composición de alimentos...</span>
            </div>
          )}

           {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {!analysis && !loading && (
            <div className="h-80 flex flex-col items-center justify-center text-gray-400 bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
              <Activity className="w-16 h-16 mb-4 opacity-20" />
              <p>Los resultados aparecerán aquí</p>
            </div>
          )}

          {analysis && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-emerald-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 capitalize">{analysis.foodName}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${analysis.healthScore >= 7 ? 'bg-green-100 text-green-700' : analysis.healthScore >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  Salud: {analysis.healthScore}/10
                </span>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="col-span-2 sm:col-span-1 flex flex-col justify-center space-y-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <span className="block text-3xl font-bold text-gray-800">{analysis.calories}</span>
                    <span className="text-sm text-gray-500 uppercase tracking-wide">Calorías</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between"><span>Proteína:</span> <span className="font-semibold text-blue-600">{analysis.protein}g</span></div>
                    <div className="flex justify-between"><span>Carbohidratos:</span> <span className="font-semibold text-emerald-600">{analysis.carbs}g</span></div>
                    <div className="flex justify-between"><span>Grasa:</span> <span className="font-semibold text-amber-500">{analysis.fat}g</span></div>
                  </div>
                </div>

                <div className="col-span-2 mt-2">
                   <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-800 text-sm mb-1">Análisis IA</p>
                        <p className="text-blue-700 text-sm">{analysis.summary}</p>
                      </div>
                   </div>
                   <div className="mt-3 text-sm text-gray-600 italic">
                     "{analysis.advice}"
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};