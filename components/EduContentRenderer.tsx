import React from 'react';
import { CourseEducation } from '../types';

interface EduContentRendererProps {
  data: CourseEducation;
}

export const EduContentRenderer: React.FC<EduContentRendererProps> = ({ data }) => {
  return (
    <div className="space-y-10 font-sans text-slate-300 leading-relaxed">
      {/* Introduction */}
      <section>
        <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-cyber-primary">info</span>
          Introduction
        </h2>
        <p className="text-lg">{data.introduction}</p>
      </section>

      {/* Technical Deep Dive */}
      <section className="bg-white/5 p-6 border-l-4 border-cyber-primary">
        <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider text-sm font-tech">Technical Deep Dive</h3>
        <p>{data.technicalDeepDive}</p>
      </section>

      {/* Vulnerable Code */}
      <section>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-cyber-accent">code</span>
          Vulnerable Implementation
        </h3>
        <div className="bg-black/60 rounded-lg p-4 border border-white/10 font-mono text-sm overflow-x-auto">
          <pre className="text-cyber-accent">
            <code>{data.vulnerableCode}</code>
          </pre>
        </div>
      </section>

      {/* Exploitation Steps */}
      <section>
        <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest text-xs font-tech border-b border-white/10 pb-2">
          {data.exploitationSteps.title}
        </h3>
        <ul className="space-y-3">
          {data.exploitationSteps.steps.map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyber-accent/20 border border-cyber-accent/40 flex items-center justify-center text-[10px] font-bold text-cyber-accent">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Impact */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cyber-accent/5 border border-cyber-accent/20 p-5 rounded-lg">
          <h3 className="text-cyber-accent font-bold mb-3 flex items-center gap-2 uppercase text-xs font-tech">
            <span className="material-symbols-outlined text-sm">warning</span>
            Potential Impact
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {data.impact.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div className="bg-cyber-success/5 border border-cyber-success/20 p-5 rounded-lg">
          <h3 className="text-cyber-success font-bold mb-3 flex items-center gap-2 uppercase text-xs font-tech">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            Blue Team Detection
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {data.blueTeamDetection.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </section>

      {/* Real World Case */}
      <section className="bg-cyber-dark p-6 border border-white/5 rounded-xl italic">
        <h4 className="text-white font-bold not-italic mb-2 text-sm uppercase font-tech tracking-widest">Real World Case: {data.realWorldCase.title}</h4>
        <p className="text-slate-400">"{data.realWorldCase.description}"</p>
      </section>

      {/* Mitigation */}
      <section>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-cyber-success">gpp_good</span>
          Mitigation & Defense
        </h3>
        <div className="space-y-4">
          <ul className="list-disc list-inside space-y-2">
            {data.mitigation.strategies.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
          {data.mitigation.codeFix && (
            <div className="bg-cyber-success/10 p-4 rounded border border-cyber-success/30">
              <div className="text-[10px] font-bold text-cyber-success uppercase mb-2 font-tech">Recommended Fix</div>
              <code className="text-sm font-mono text-white">{data.mitigation.codeFix}</code>
            </div>
          )}
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="bg-gradient-to-r from-cyber-primary/10 to-transparent p-6 rounded-r-lg border-l-2 border-cyber-primary">
        <h3 className="text-white font-bold mb-4 uppercase text-xs font-tech tracking-widest">Key Takeaways</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.keyTakeaways.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-cyber-primary text-sm">check_circle</span>
              {t}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
