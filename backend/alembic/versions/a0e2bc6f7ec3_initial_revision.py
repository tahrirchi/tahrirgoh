"""Initial revision

Revision ID: a0e2bc6f7ec3
Revises: 
Create Date: 2023-06-08 15:30:03.204245

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from app.utils.jwt import pass_ctx
from app.core.config import settings


revision = 'a0e2bc6f7ec3'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('is_admin', sa.Boolean(), nullable=False),
        sa.Column('paid_amount', sa.Integer(), nullable=False, server_default=str(0)),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('username')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Sentence table
    op.create_table(
        'sentence',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('value', sa.String(), nullable=False),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('on_review', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('reviewed_by', sa.Integer(), nullable=True),
        sa.Column('review_timestamp', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['reviewed_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sentence_id'), 'sentence', ['id'], unique=False)

    # Annotation table
    op.create_table(
        'annotation',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sentence_id', sa.Integer(), nullable=True),
        sa.Column('from_index', sa.Integer(), nullable=False),
        sa.Column('to_index', sa.Integer(), nullable=False),
        sa.Column('old_value', sa.String(), nullable=False),
        sa.Column('new_value', sa.String(), nullable=False),
        sa.Column('error_type', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['sentence_id'], ['sentence.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_annotation_id'), 'annotation', ['id'], unique=False)

    # Create admin user
    users_table = table(
        "users",
        column("id", sa.Integer),
        column("username", sa.String),
        column("password", sa.String),
        column("is_admin", sa.Boolean),
    )

    op.bulk_insert(
        users_table,
        [
            {
                "username": settings.ADMIN_USERNAME,
                "password": pass_ctx.hash(settings.ADMIN_PASSWORD),
                "is_admin": True
            }
        ],
    )


def downgrade() -> None:
    op.drop_index(op.f('ix_annotation_id'), table_name='annotation')
    op.drop_table('annotation')

    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')

    op.drop_index(op.f('ix_sentence_id'), table_name='sentence')
    op.drop_table('sentence')
