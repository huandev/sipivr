package ru.sipivr.core.model.base;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by okarpukhin on 18.02.2018.
 */
@MappedSuperclass
public abstract class AbstractCreatableEntity  implements Serializable {
    @Column(nullable = false, updatable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS")
    private Date createDate;

    public AbstractCreatableEntity(){
        createDate = new Date();
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
}
