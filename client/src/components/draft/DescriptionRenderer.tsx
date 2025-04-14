type DescriptionType = {
    summary: string;
    details?: string[];
    prerequisites?: string[];
    process?: string[];
    note?: string;
  };
  
  type DescriptionRendererProps = {
    description?: DescriptionType;
  };
  
  export default function DescriptionRenderer({ description }: DescriptionRendererProps) {
    if (!description) return null;
  
    return (
      <div className="text-slate-300 space-y-4 mb-6">
        <p>{description.summary}</p>
  
        {description.details && (
          <div>
            <h3 className="font-semibold">Key components include:</h3>
            <ul className="list-decimal list-inside ml-4">
              {description.details.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
  
        {description.prerequisites && (
          <div>
            <h3 className="font-semibold">Prerequisites:</h3>
            <ul className="list-decimal list-inside ml-4">
              {description.prerequisites.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
  
        {description.process && (
          <div>
            <h3 className="font-semibold">Process:</h3>
            <ol className="list-decimal list-inside ml-4">
              {description.process.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
  
        {description.note && (
          <div>
            <h3 className="font-semibold underline">Note:</h3>
            <p className="font-extrabold">{description.note}</p>
          </div>
        )}
      </div>
    );
  }