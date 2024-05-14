class CreateVisitedSites < ActiveRecord::Migration[7.1]
  def change
    create_table :visited_sites do |t|
      t.string :url
      t.datetime :visited_at

      t.timestamps
    end
  end
end
