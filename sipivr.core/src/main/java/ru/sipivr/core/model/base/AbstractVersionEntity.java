package ru.sipivr.core.model.base;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by Karpukhin on 03.01.2016.
 */
@MappedSuperclass
public abstract class AbstractVersionEntity extends AbstractCreatableEntity {
    @Version
    @Column(nullable = false)
    private int rowVersion;

    public int getRowVersion() {
        return rowVersion;
    }

    public void setRowVersion(int rowVersion) {
        this.rowVersion = rowVersion;
    }
}
