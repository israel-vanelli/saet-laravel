import { LoaderCircle } from "lucide-react";

export default function Loading ({ condition = true, outerDivClassName = '', loaderDivClassName = '' }) {
  return (
    <>
      {condition && (
        
        <div className={`fixed  inset-0 flex items-center justify-center ${outerDivClassName}`}>
          <LoaderCircle className="h-10 w-10 animate-spin mr-2" />
        </div>
      )}
    </>
  );
};