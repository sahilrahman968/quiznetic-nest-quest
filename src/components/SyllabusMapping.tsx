import { useEffect, useState } from "react";
import { Control, useController } from "react-hook-form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import {
  fetchBoards,
  fetchClasses,
  fetchSubjects,
  fetchChapters,
  fetchTopics,
  SyllabusItem 
} from "@/services/api";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

interface SyllabusMappingProps {
  control: Control<any>;
}

const SyllabusMapping = ({ control }: SyllabusMappingProps) => {
  const [boards, setBoards] = useState<SyllabusItem[]>([]);
  const [classes, setClasses] = useState<SyllabusItem[]>([]);
  const [subjects, setSubjects] = useState<SyllabusItem[]>([]);
  const [chapters, setChapters] = useState<SyllabusItem[]>([]);
  const [topics, setTopics] = useState<SyllabusItem[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch boards without parameters
        const boardsData = await fetchBoards();
        setBoards(boardsData);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    loadInitialData();
  }, []);

  const { field: boardField } = useController({
    name: "syllabusMapping.board",
    control,
  });

  useEffect(() => {
    const loadClasses = async () => {
      if (boardField.value) {
        try {
          // Fetch classes without parameters
          const classesData = await fetchClasses();
          setClasses(classesData);
        } catch (error) {
          console.error("Error fetching classes:", error);
        }
      }
    };

    loadClasses();
  }, [boardField.value]);

  const { field: classField } = useController({
    name: "syllabusMapping.class",
    control,
  });

  useEffect(() => {
    const loadSubjects = async () => {
      if (classField.value) {
        try {
          // Fetch subjects without parameters
          const subjectsData = await fetchSubjects();
          setSubjects(subjectsData);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      }
    };

    loadSubjects();
  }, [classField.value]);

  const { field: subjectField } = useController({
    name: "syllabusMapping.subject",
    control,
  });

  useEffect(() => {
    const loadChapters = async () => {
      if (subjectField.value) {
        try {
          // Fetch chapters without parameters
          const chaptersData = await fetchChapters();
          setChapters(chaptersData);
        } catch (error) {
          console.error("Error fetching chapters:", error);
        }
      }
    };

    loadChapters();
  }, [subjectField.value]);

  const { field: chapterField } = useController({
    name: "syllabusMapping.chapter",
    control,
  });

  useEffect(() => {
    const loadTopics = async () => {
      if (chapterField.value) {
        try {
          const topicsData = await fetchTopics();
          setTopics(topicsData);
        } catch (error) {
          console.error("Error fetching topics:", error);
        }
      }
    };

    loadTopics();
  }, [chapterField.value]);

  const { field: topicField } = useController({
    name: "syllabusMapping.topic",
    control,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="syllabusMapping.board"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Board</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a board" />
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a chapter" />
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
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
  );
};

export default SyllabusMapping;
