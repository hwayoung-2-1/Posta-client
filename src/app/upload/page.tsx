'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import FormatStep, { UploadFormat } from '@/components/upload/FormatStep'
import FileStep, { FileState } from '@/components/upload/FileStep'
import LinkStep from '@/components/upload/LinkStep'
import WriteStep from '@/components/upload/WriteStep'
import { uploadPdfPortfolio } from '@/lib/api/portfolioApi'

type Step = 'format' | 'file' | 'link' | 'write'

export default function UploadPage() {
  const router = useRouter()

  const [step, setStep] = useState<Step>('format')
  const [format, setFormat] = useState<UploadFormat>('file')

  const [fileState, setFileState] = useState<FileState>('empty')
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState('')
  const [portfolioId, setPortfolioId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const fileRef = useRef<File | null>(null)
  const [linkValue, setLinkValue] = useState('')

  const handleFileSelect = async (file: File) => {
    fileRef.current = file
    setFileName(file.name)
    setFileState('uploading')
    setProgress(20)
    setUploadError(null)

    try {
      const title = file.name.replace(/\.[^/.]+$/, '')
      setProgress(60)
      const res = await uploadPdfPortfolio(file, { title })
      setPortfolioId(res.id)
      setProgress(100)
      setFileState('uploaded')
    } catch {
      setUploadError('업로드에 실패했습니다. 다시 시도해주세요.')
      setFileState('empty')
      setProgress(0)
      fileRef.current = null
    }
  }

  const removeFile = () => {
    fileRef.current = null
    setFileState('empty')
    setProgress(0)
    setFileName('')
    setPortfolioId(null)
    setUploadError(null)
  }

  const onComplete = () => {
    if (portfolioId) {
      router.push(`/portfolio/${portfolioId}`)
    } else {
      router.push('/portfolio')
    }
  }

  const goFormat = () => setStep('format')

  return (
    <>
      {step === 'format' && (
        <FormatStep
          selected={format}
          onSelect={setFormat}
          onNext={() => setStep(format === 'file' ? 'file' : 'link')}
        />
      )}

      {step === 'file' && (
        <>
          <FileStep
            state={fileState}
            fileName={fileName}
            progress={progress}
            onFileSelect={handleFileSelect}
            onRemoveFile={removeFile}
            onPrev={goFormat}
            onNext={() => setStep('write')}
          />
          {uploadError && (
            <p className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-[8px] bg-[#e5484d] px-6 py-3 text-[14px] text-white">
              {uploadError}
            </p>
          )}
        </>
      )}

      {step === 'link' && (
        <LinkStep
          value={linkValue}
          onChange={setLinkValue}
          onPrev={goFormat}
          onNext={() => setStep('write')}
        />
      )}

      {step === 'write' && <WriteStep mode={format} onComplete={onComplete} />}
    </>
  )
}
