import React from 'react';
import { motion } from 'framer-motion';

const BlobBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-background pointer-events-none">
      <div 
        className="absolute top-0 -left-64 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"
      ></div>
      <div 
        className="absolute top-0 -right-64 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"
      ></div>
      <div 
        className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"
      ></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none"></div>
    </div>
  );
};

export default BlobBackground;
