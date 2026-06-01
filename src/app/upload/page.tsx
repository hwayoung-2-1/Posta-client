"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FormatStep, { UploadFormat } from "@/components/upload/FormatStep";
import FileStep, { FileState } from "@/components/upload/FileStep";
import LinkStep from "@/components/upload/LinkStep";
import WriteStep from "@/components/upload/WriteStep";

type Step = "format" | "file" | "link" | "write";

export default function UploadPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("format");
  const [format, setFormat] = useState<UploadFormat>("file");

  // 파일 업로드 상태
  const [fileState, setFileState] = useState<FileState>("empty");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 링크 입력 상태
  const [linkValue, setLinkValue] = useState("");

  const startUpload = () => {
    setFileState("uploading");
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          setFileName("example_portfolio_20260507.pdf");
          setFileState("uploaded");
          return 100;
        }
        return next;
      });
    }, 180);
  };

  const removeFile = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFileState("empty");
    setProgress(0);
    setFileName("");
  };

  const goFormat = () => setStep("format");
  const onComplete = () => router.push("/portfolio");

  return (
    <>
      {step === "format" && (
        <FormatStep
          selected={format}
          onSelect={setFormat}
          onNext={() => setStep(format === "file" ? "file" : "link")}
        />
      )}

      {step === "file" && (
        <FileStep
          state={fileState}
          fileName={fileName}
          progress={progress}
          onPickFile={startUpload}
          onRemoveFile={removeFile}
          onPrev={goFormat}
          onNext={() => setStep("write")}
        />
      )}

      {step === "link" && (
        <LinkStep
          value={linkValue}
          onChange={setLinkValue}
          onPrev={goFormat}
          onNext={() => setStep("write")}
        />
      )}

      {step === "write" && <WriteStep mode={format} onComplete={onComplete} />}
    </>
  );
}
