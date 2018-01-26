package ru.sipivr.sound.viewModel;

import org.apache.commons.io.FilenameUtils;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class WavTreeNode {
    private final boolean isDirectory;
    private final String name;
    private final String path;

    private final List<WavTreeNode> Childs;

    private WavTreeNode(File fileOrDirectory, String rootPath) {
        this.isDirectory = fileOrDirectory.isDirectory();
        this.name = fileOrDirectory.getName();
        this.path = fileOrDirectory.getPath().replace(rootPath, "");

        if(this.isDirectory) {
            this.Childs = fromDirectory(fileOrDirectory, rootPath);
        } else {
            this.Childs = null;
        }
    }

    public boolean isDirectory() {
        return isDirectory;
    }

    public String getName() {
        return name;
    }

    public String getPath() {
        return path;
    }

    public List<WavTreeNode> getChilds() {
        return Childs;
    }

    public static List<WavTreeNode> fromDirectory(File fileOrDirectory, String rootPath) {
        List<WavTreeNode> result = new ArrayList<>();
        for (File file: fileOrDirectory.listFiles()){
            if(file.isDirectory()){
                result.add(new WavTreeNode(file, rootPath == null ? fileOrDirectory.getPath() : rootPath));
            }

        }

        for (File file: fileOrDirectory.listFiles()){
            if(!file.isDirectory()){
                String extension = FilenameUtils.getExtension(file.getName());
                if (extension.equalsIgnoreCase("wav")) {
                    result.add(new WavTreeNode(file, rootPath == null ? fileOrDirectory.getPath() : rootPath));
                }
            }

        }
        return result;
    }
}