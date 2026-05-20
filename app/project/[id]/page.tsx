import Editor from '@/components/Editor'

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <Editor projectId={params.id} />
}
