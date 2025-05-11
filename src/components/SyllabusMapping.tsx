
import { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SyllabusItem, fetchBoards, fetchChapters, fetchClasses, fetchSubjects, fetchTopics } from "@/services/api";

interface SyllabusMappingProps {
  control: Control<any>;
}

export const SyllabusMapping = ({ control }: SyllabusMappingProps) => {
  const [boards, setBoards] = useState<SyllabusItem[]>([]);
  const [classes, setClasses] = useState<SyllabusItem[]>([]);
  const [subjects, setSubjects] = useState<SyllabusItem[]>([]);
  const [chapters, setChapters] = useState<SyllabusItem[]>([]);
  const [topics, setTopics] = useState<SyllabusItem[]>([]);

  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  useEffect(() => {
    const loadBoards = async () => {
      const data = await fetchBoards();
      setBoards(data);
    };
    loadBoards();
  }, []);

  useEffect(() => {
    if (selectedBoardId) {
      const loadClasses = async () => {
        const data = await fetchClasses(selectedBoardId);
        setClasses(data);
      };
      loadClasses();
    } else {
      setClasses([]);
    }
    setSelectedClassId(null);
    setSubjects([]);
    setChapters([]);
    setTopics([]);
  }, [selectedBoardId]);

  useEffect(() => {
    if (selectedClassId) {
      const loadSubjects = async () => {
        const data = await fetchSubjects(selectedClassId);
        setSubjects(data);
      };
      loadSubjects();
    } else {
      setSubjects([]);
    }
    setSelectedSubjectId(null);
    setChapters([]);
    setTopics([]);
  }, [selectedClassId]);

  useEffect(() => {
    if (selectedSubjectId) {
      const loadChapters = async () => {
        const data = await fetchChapters(selectedSubjectId);
        setChapters(data);
      };
      loadChapters();
    } else {
      setChapters([]);
    }
    setSelectedChapterId(null);
    setTopics([]);
  }, [selectedSubjectId]);

  useEffect(() => {
    if (selectedChapterId) {
      const loadTopics = async () => {
        const data = await fetchTopics(selectedChapterId);
        setTopics(data);
      };
      loadTopics();
    } else {
      setTopics([]);
    }
  }, [selectedChapterId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Syllabus Mapping</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="syllabusMapping.board"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board</FormLabel>
              <Select
                onValueChange={(value) => {
                  const selected = boards.find(b => b.id === value);
                  if (selected) {
                    field.onChange({ id: selected.id, name: selected.name });
                    setSelectedBoardId(selected.id);
                  }
                }}
                value={field.value?.id || ""}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="syllabusMapping.class"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select
                onValueChange={(value) => {
                  const selected = classes.find(c => c.id === value);
                  if (selected) {
                    field.onChange({ id: selected.id, name: selected.name });
                    setSelectedClassId(selected.id);
                  }
                }}
                value={field.value?.id || ""}
                disabled={!selectedBoardId}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="syllabusMapping.subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select
                onValueChange={(value) => {
                  const selected = subjects.find(s => s.id === value);
                  if (selected) {
                    field.onChange({ id: selected.id, name: selected.name });
                    setSelectedSubjectId(selected.id);
                  }
                }}
                value={field.value?.id || ""}
                disabled={!selectedClassId}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="syllabusMapping.chapter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chapter</FormLabel>
              <Select
                onValueChange={(value) => {
                  const selected = chapters.find(c => c.id === value);
                  if (selected) {
                    field.onChange([{ id: selected.id, name: selected.name }]);
                    setSelectedChapterId(selected.id);
                  }
                }}
                value={field.value?.[0]?.id || ""}
                disabled={!selectedSubjectId}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      {chapter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="syllabusMapping.topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <Select
                onValueChange={(value) => {
                  const selected = topics.find(t => t.id === value);
                  if (selected) {
                    field.onChange([{ id: selected.id, name: selected.name }]);
                  }
                }}
                value={field.value?.[0]?.id || ""}
                disabled={!selectedChapterId}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SyllabusMapping;
