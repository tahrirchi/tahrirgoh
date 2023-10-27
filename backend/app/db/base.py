from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, text

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    is_admin = Column(Boolean, nullable=False, default=False)
    paid_amount = Column(Integer, nullable=False, default=0)

    sentences_reviewed = relationship("Sentence", back_populates="reviewer")


class Sentence(Base):
    __tablename__ = "sentence"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(String, nullable=False)
    source = Column(String)

    on_review = Column(Boolean, nullable=False, default=False)
    review_timestamp = Column(DateTime, nullable=False, default=text("NOW()"))
    reviewed_by = Column(Integer, ForeignKey("users.id"))

    reviewer = relationship("User", back_populates="sentences_reviewed")
    annotations = relationship("Annotation", back_populates="sentence")


class Annotation(Base):
    __tablename__ = "annotation"

    id = Column(Integer, primary_key=True, index=True)
    sentence_id = Column(Integer, ForeignKey("sentence.id"))

    from_index = Column(Integer, nullable=False)
    to_index = Column(Integer, nullable=False)
    old_value = Column(String, nullable=False)
    new_value = Column(String, nullable=False)

    error_type = Column(String)

    sentence = relationship("Sentence", back_populates="annotations")
