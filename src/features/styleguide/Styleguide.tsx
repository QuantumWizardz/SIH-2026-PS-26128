
import { Button } from '../../design/Button';
import { CircleMask } from '../../design/CircleMask';
import { ArchMask } from '../../design/ArchMask';
import { RiskBadge } from '../../design/RiskBadge';
import { ScoreDial } from '../../design/ScoreDial';
import { UnknownValue } from '../../design/UnknownValue';
import { EvidenceList } from '../../design/EvidenceList';

export function Styleguide() {
  return (
    <div className="space-y-[112px]">
      <section>
        <h1 className="text-4xl mb-4">Design System</h1>
        <p className="text-lg text-espresso-70 max-w-2xl">
          A showcase of the primitive components and design tokens defining the "Earthy Modern Minimalist" aesthetic of Pashu Rakshak.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-[64px]">
        <div>
          <h2 className="text-2xl mb-8">Typography & Colors</h2>
          <div className="space-y-4">
            <h1 className="text-4xl">Heading 1 (72px)</h1>
            <h2 className="text-3xl">Heading 2 (52px)</h2>
            <h3 className="text-2xl">Heading 3 (36px)</h3>
            <p className="text-base text-espresso-70 max-w-lg mt-6">
              Body text (17px). The quick brown fox jumps over the lazy dog. 
              Extremely generous macro-whitespace. 
              <UnknownValue />
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl mb-8">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button>Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="active">Active State</Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-[64px] items-start">
        <div className="col-span-1">
          <h2 className="text-2xl mb-8">Image Masks</h2>
          <div className="space-y-12">
            <CircleMask size={200} />
            <ArchMask width={160} height={220} />
          </div>
        </div>
        <div className="col-span-2 space-y-[64px]">
          <div>
            <h2 className="text-2xl mb-8">Risk Indicators</h2>
            <div className="flex flex-wrap gap-4">
              <RiskBadge tier="NORMAL" label="Low Risk" />
              <RiskBadge tier="WATCH" label="Watch" />
              <RiskBadge tier="HIGH" label="High Priority" score={86} />
              <RiskBadge tier="CRITICAL" label="Critical" />
              <RiskBadge tier="ZOONOTIC" label="Zoonotic Risk" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
             <div>
                <h2 className="text-2xl mb-8">Score Dials</h2>
                <div className="flex gap-8">
                  <ScoreDial score={42} label="Investigation priority" tier="WATCH" />
                  <ScoreDial score={86} label="Outbreak risk" tier="HIGH" />
                </div>
             </div>
             <div>
                <h2 className="text-2xl mb-8">Evidence List</h2>
                <EvidenceList 
                  reasons={[
                    "Multiple nearby villages affected",
                    "Reports concentrated within 52 hours",
                    "High symptom similarity",
                    "Cases increasing rapidly",
                    "5 deaths reported"
                  ]}
                />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
